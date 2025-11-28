'use server';

import fs from 'fs';
import path from 'path';

interface GenerateImageParams {
  prompt: string;
  aspectRatio?: "16:9" | "1:1" | "4:3" | "3:4" | "9:16";
}

export async function generateImage({ prompt, aspectRatio = "16:9" }: GenerateImageParams) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, error: "API Key not configured" };
  }

  try {
    // The user provided a Python example for 'gemini-2.5-flash-image' using 'generate_content'.
    // We translate this to the REST API.
    // Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          // Important: The example didn't specify generationConfig, but it's often needed for image output.
          // However, if the model defaults to text+image based on prompt, we try standard config.
          // We add responseModalities to explicitly request IMAGE if possible, or rely on the model.
          generationConfig: {
            responseModalities: ["IMAGE"],
             imageConfig: {
               // The model supports aspect ratios, we pass it here if needed or default
               // Note: Check API docs if aspect_ratio is supported in this exact path for 2.5.
               // Assuming standard Gemini Image generation config structure.
               aspectRatio: aspectRatio
             }
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Inspect response structure based on Python example:
    // response.candidates[0].content.parts[].inline_data.data
    // REST API typically uses lowerCamelCase: inlineData
    
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );

    const base64Image = imagePart?.inlineData?.data;

    if (!base64Image) {
      console.error("Full Response Data:", JSON.stringify(data, null, 2));
      throw new Error("No image data received from API (inlineData missing)");
    }

    // Save to file system
    const saveDir = path.join(process.cwd(), 'public/images/generated');
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const filename = `gen-${Date.now()}.png`;
    const filepath = path.join(saveDir, filename);
    const buffer = Buffer.from(base64Image, 'base64');
    
    fs.writeFileSync(filepath, buffer);

    // Return as a relative URL
    return { 
      success: true, 
      imageUrl: `/images/generated/${filename}` 
    };

  } catch (error: any) {
    console.error("Image Generation Failed:", error);
    return { success: false, error: error.message || "Failed to generate image" };
  }
}
