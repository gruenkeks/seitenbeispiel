'use server';

import fs from 'fs';
import path from 'path';

interface GenerateImageParams {
  prompt: string;
  aspectRatio?: "16:9" | "1:1" | "4:3" | "3:4" | "9:16";
  sectionKey?: string; // If provided, save to permanent path /images/{sectionKey}/image.png
}

const sanitizeSectionKey = (rawKey: string) => {
  return rawKey
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
};

const getSectionImagePaths = (sectionKey: string) => {
  const safeKey = sanitizeSectionKey(sectionKey);
  const sectionDir = path.join(process.cwd(), 'public', 'images', 'sections', safeKey);
  const filePath = path.join(sectionDir, 'image.png');
  const publicUrl = `/images/sections/${safeKey}/image.png`;
  return { sectionDir, filePath, publicUrl };
};

const ensureCleanDirectory = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
};

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
      const { sectionDir, filePath, publicUrl } = getSectionImagePaths(sectionKey);
      ensureCleanDirectory(sectionDir);
      fs.writeFileSync(filePath, buffer);
      imageUrl = publicUrl;
    } else {
      // Fallback: generated folder only keeps latest image
      const saveDir = path.join(process.cwd(), 'public', 'images', 'generated');
      ensureCleanDirectory(saveDir);
      const filepath = path.join(saveDir, 'image.png');
      fs.writeFileSync(filepath, buffer);
      imageUrl = `/images/generated/image.png`;
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
