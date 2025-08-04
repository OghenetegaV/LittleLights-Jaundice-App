import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure of the API response
interface JaundiceResult {
  riskLevel: 'Low Risk' | 'Monitor Closely' | 'Urgent Consultation Recommended' | 'Error';
  explanation: string;
}

/**
 * Handles POST requests to the /api/detect-jaundice route.
 * This function processes an image and sends it to a large language model
 * for a simulated jaundice risk assessment.
 */
export async function POST(req: NextRequest) {
  try {
    // Check for a valid API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set.");
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Parse the request body to get the image data
    const { imageData, mimeType } = await req.json();
    if (!imageData || !mimeType) {
      return NextResponse.json({ error: 'Image data or mimeType is missing' }, { status: 400 });
    }

    // Prepare the payload for the Gemini API call
    const chatHistory = [
      {
        role: "user",
        parts: [
          { text: "Analyze this image of a newborn's skin to assess the risk of neonatal jaundice. Provide a simple risk level (e.g., 'Low Risk', 'Monitor Closely', 'Urgent Consultation Recommended') and a brief explanation. Do not give a medical diagnosis. The risk level and explanation should be based on the apparent degree of yellowing. Use a friendly and reassuring tone. Return a JSON object with 'riskLevel' and 'explanation' fields." },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageData
            }
          }
        ]
      }
    ];

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "riskLevel": { "type": "STRING" },
            "explanation": { "type": "STRING" }
          },
          "propertyOrdering": ["riskLevel", "explanation"]
        }
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Make the API call with exponential backoff for resilience
    let result;
    for (let i = 0; i < 3; i++) { // Retry up to 3 times
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        result = await response.json();
        break; // Exit loop on success
      } catch (e) {
        console.error(`API call attempt ${i + 1} failed:`, e);
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000)); // Exponential backoff
        } else {
          throw e; // Re-throw the error after all retries
        }
      }
    }

    // Safely parse the model's response and handle potential errors
    const modelResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!modelResponse) {
      console.error("Model response was empty or malformed:", JSON.stringify(result, null, 2));
      return NextResponse.json(
        { error: 'AI model did not return a valid response.' },
        { status: 500 }
      );
    }

    // The model should return a JSON string, so we parse it
    let parsedResult: JaundiceResult;
    try {
      parsedResult = JSON.parse(modelResponse);
    } catch (e) {
      console.error("Failed to parse model's JSON response:", modelResponse);
      return NextResponse.json(
        { error: 'AI model returned an unparsable response.' },
        { status: 500 }
      );
    }

    // Return the final result to the front-end
    return NextResponse.json(parsedResult, { status: 200 });

  } catch (err) {
    console.error('API endpoint error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during processing.' },
      { status: 500 }
    );
  }
}

