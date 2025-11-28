'use server';

import fs from 'fs';
import path from 'path';

interface GenerateImageParams {
  prompt: string;
  aspectRatio?: "16:9" | "1:1" | "4:3" | "3:4" | "9:16";
  sectionKey?: string; // If provided, save to permanent path /images/{sectionKey}.png and clean generated/
}

export async function generateImage({ prompt, aspectRatio = "16:9", sectionKey }: GenerateImageParams) {
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
          generationConfig: {
            responseModalities: ["IMAGE"],
             imageConfig: {
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

    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );

    const base64Image = imagePart?.inlineData?.data;

    if (!base64Image) {
      console.error("Full Response Data:", JSON.stringify(data, null, 2));
      throw new Error("No image data received from API (inlineData missing)");
    }

    const buffer = Buffer.from(base64Image, 'base64');

    let imageUrl: string;

    if (sectionKey) {
      // Permanent path: delete old if exists, save to /images/{sectionKey}.png
      const permanentPath = path.join(process.cwd(), 'public', 'images', `${sectionKey}.png`);
      if (fs.existsSync(permanentPath)) {
        fs.unlinkSync(permanentPath); // Delete old
      }

      // Ensure images dir exists
      const imagesDir = path.dirname(permanentPath);
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      fs.writeFileSync(permanentPath, buffer);
      imageUrl = `/images/${sectionKey}.png`;

      // Clean generated folder
      const generatedDir = path.join(process.cwd(), 'public', 'images', 'generated');
      if (fs.existsSync(generatedDir)) {
        fs.rmSync(generatedDir, { recursive: true, force: true });
      }
    } else {
      // Fallback: generated folder with timestamp (for non-builder uses)
      const saveDir = path.join(process.cwd(), 'public', 'images', 'generated');
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      const filename = `gen-${Date.now()}.png`;
      const filepath = path.join(saveDir, filename);
      fs.writeFileSync(filepath, buffer);
      imageUrl = `/images/generated/${filename}`;
    }

    return {
      success: true,
      imageUrl
    };

  } catch (error: any) {
    console.error("Image Generation Failed:", error);
    return { success: false, error: error.message || "Failed to generate image" };
  }
}
