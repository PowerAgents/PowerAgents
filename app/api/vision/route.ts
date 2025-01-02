import { NextResponse } from 'next/server';
import { analyzeImageWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    // 1. Extract and validate the image URL from the request
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    console.log('Received vision request for Gemini Pro Vision. Image URL:', imageUrl);

    // 2. Analyze the image using the LangChain-enhanced function
    const analysis = await analyzeImageWithGemini(imageUrl);

    console.log('Raw Gemini Pro Vision analysis result:', analysis);

    // 3. Parse and clean up the result
    let parsedAnalysis;
    try {
      if (typeof analysis === 'string') {
        // Remove backticks and language hints if any (e.g., "```json ... ```")
        const cleanedAnalysis = analysis.replace(/^[`json\s]+|[`]+$/g, '');
        parsedAnalysis = JSON.parse(cleanedAnalysis);
      } else {
        // If `analysis` is already parsed
        parsedAnalysis = analysis;
      }
    } catch (error) {
      console.error('Error parsing Gemini analysis result:', error);
      return NextResponse.json({
        error: 'Failed to parse analysis result from Gemini Pro Vision',
        details: error instanceof Error ? error.message : String(error),
      }, { status: 500 });
    }

    // 4. Return the structured analysis result
    return NextResponse.json({
      content: parsedAnalysis,
      agent: 'vision',
    });

  } catch (error) {
    // Handle unexpected errors gracefully
    console.error('Error in vision API with Gemini Pro Vision:', error);
    return NextResponse.json({
      error: 'Failed to process vision request with Gemini Pro Vision',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// Enable the Edge runtime for faster processing
export const runtime = 'edge';
