'use server'

import { LeadPayload } from "@/types";

export async function submitLead(data: LeadPayload) {
  console.log("submitLead called at", new Date().toISOString());
  console.log("Data payload:", JSON.stringify(data, null, 2));
  
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  console.log("Using Webhook URL:", webhookUrl);

  if (!webhookUrl) {
    console.error("N8N_WEBHOOK_URL is not defined");
    return { success: false, error: "Server configuration error: N8N_WEBHOOK_URL missing" };
  }

  try {
    console.log("Initiating fetch...");
    
    // Add a timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      cache: 'no-store', // Ensure no caching
    });

    clearTimeout(timeoutId);
    console.log("Fetch response received. Status:", response.status);

    if (!response.ok) {
      const text = await response.text().catch(() => "No body");
      console.error(`Webhook error response: ${text}`);
      throw new Error(`Webhook at ${webhookUrl} failed with status ${response.status}: ${text}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit lead (Exception):", error);
    
    let errorMessage = "Failed to send request";
    if (error.name === 'AbortError') {
      errorMessage = "Request timed out after 10 seconds";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}
