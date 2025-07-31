import { NextRequest, NextResponse } from 'next/server';

// This function implements exponential backoff for API calls.
// It retries a given asynchronous function with increasing delays.
async function exponentialBackoff<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < maxRetries - 1) {
        console.error(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for the next attempt
      } else {
        console.error(`All ${maxRetries} attempts failed.`);
        throw error;
      }
    }
  }
  // This part is unreachable but satisfies TypeScript
  throw new Error("Exponential backoff failed to complete.");
}

// Handles POST requests to the API route.
export async function POST(req: NextRequest) {
  try {
    const { imageData, mimeType } = await req.json();

    // Retrieve the API key from environment variables.
    // Ensure this is set in your .env.local file.
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    // Define the prompt for the Gemini model.
    const prompt = `
      You are an AI assistant specialized in analyzing images for signs of newborn jaundice.
      Analyze the provided image of a baby's skin. Look for a yellowish discoloration, which is a key sign of jaundice.
      Based on the visual evidence, classify the risk level for jaundice.
      Provide one of the following risk levels: 'Low Risk', 'Monitor Closely', or 'Urgent Consultation Recommended'.
      Additionally, provide a brief, professional explanation for your classification.

      Respond in a JSON format with two keys:
      1. 'riskLevel': a string with the risk classification.
      2. 'explanation': a string with the explanation.

      Example response:
      {
        "riskLevel": "Low Risk",
        "explanation": "Based on the image, there is no significant yellowish hue detected on the skin. The coloration appears normal for the infant's skin tone."
      }
      {
        "riskLevel": "Monitor Closely",
        "explanation": "A faint yellow tinge is visible on the face and chest. While not severe, it's recommended to continue monitoring and consult a pediatrician if the color deepens or spreads."
      }
      {
        "riskLevel": "Urgent Consultation Recommended",
        "explanation": "A noticeable yellow discoloration is present on the face, chest, and abdomen. This suggests a higher level of bilirubin, and an immediate consultation with a healthcare professional is advised."
      }
    `;

    // Construct the payload for the Gemini API call.
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageData,
              },
            },
          ],
        },
      ],
    };

    // Use exponential backoff for the fetch call to handle potential API issues.
    const geminiResponse = await exponentialBackoff(async () => {
      // **CORRECTED:** Using the correct model name for image understanding.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the API response is not ok, throw an error to trigger the retry.
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      return response;
    });

    const geminiResult = await geminiResponse.json();

    // Check for a valid response structure from the Gemini API.
    if (
      geminiResult &&
      geminiResult.candidates &&
      geminiResult.candidates.length > 0 &&
      geminiResult.candidates[0].content &&
      geminiResult.candidates[0].content.parts &&
      geminiResult.candidates[0].content.parts.length > 0
    ) {
      let responseText = geminiResult.candidates[0].content.parts[0].text;
      
      try {
        // **FIX:** Clean the response string to remove markdown code fences (```json and ```)
        // This makes the string valid JSON before parsing.
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        }

        // Parse the JSON response from Gemini.
        const parsedResponse = JSON.parse(responseText);

        // Send the parsed JSON back to the client.
        return NextResponse.json(parsedResponse);
      } catch (e) {
        console.error('Failed to parse Gemini response as JSON:', responseText, e);
        return NextResponse.json({
          riskLevel: 'Error',
          explanation: 'Failed to process the AI response. Please try again.',
        }, { status: 500 });
      }
    } else {
      console.error('Unexpected Gemini API response structure:', geminiResult);
      return NextResponse.json({
        riskLevel: 'Error',
        explanation: 'AI returned an unexpected response. Please try again.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      {
        riskLevel: 'Error',
        explanation: 'An internal server error occurred during analysis.',
      },
      { status: 500 }
    );
  }
}
