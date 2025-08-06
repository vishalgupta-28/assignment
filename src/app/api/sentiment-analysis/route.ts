import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { string, z } from 'zod';

// Define Zod schema for structured output
const SentimentSchema = z.object({
  response: z.object({
    positive: z.number().int().nonnegative().describe('overall positive sentiment score'),
    negative: z.number().int().nonnegative().describe('overall negative sentiment score'),
    neutral: z.number().int().nonnegative().describe('overall neutral sentiment score'),
  }),
  info : string().describe('explain how user interacted with the post in very short'),
});

// Initialize LLM with Google API Key
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY environment variable is not set.');
}

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  temperature: 0,
  maxRetries: 2,
  apiKey,
});

// Bind schema to model for structured output
const llmWithStructuredOutput = llm.withStructuredOutput(SentimentSchema, {
  name: 'sentimentAnalyzer',
});

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic';

// System prompt for sentiment analysis
const SYSTEM_PROMPT = `
You are an expert in sentiment analysis for social media content. Analyze the sentiment of an Instagram Reel's caption and up to 20 comments provided as JSON data. For each text, classify the sentiment as "positive", "negative", or "neutral" with a confidence score (0 to 1). Calculate an overall sentiment score for comments (average of individual scores: positive = 1, neutral = 0, negative = -1). Return the results in JSON format conforming to the provided schema.

analysis comment text and like count and check how user interaction with the post . just explain in very short text

Rules:
1. For short or ambiguous comments (e.g., "Kohli"), assign "neutral" unless clear sentiment is detected.
2. For the caption, consider the full context (e.g., enthusiasm, negativity, or neutrality).
3. Ensure confidence scores are between 0 and 1.
4. If no comments are provided, return an empty comments array and set overallScore to 0.
5. If the input is invalid, return a default neutral response for affected fields.
`;

// POST handler for sentiment analysis
export async function POST(req: NextRequest) {
  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Invalid JSON Error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body. Ensure the request body is valid JSON.' },
      { status: 400 }
    );
  }

  // Validate input
  const { caption, comments } = body;
  if (!caption || typeof caption !== 'string' || !Array.isArray(comments)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid input: "caption" (string) and "comments" (array of strings) are required.',
      },
      { status: 400 }
    );
  }

  try {
    // Prepare input for LLM (limit to 20 comments)
    const input = {
      caption,
      comments: comments.slice(0, 20).map((c: any) => (typeof c === 'string' ? c : c.text || '')),
    };

    // Invoke LLM with structured output
    const sentimentResult = await llmWithStructuredOutput.invoke([
      ['system', SYSTEM_PROMPT],
      ['human', `Analyze this data: ${JSON.stringify(input)}`],
    ]);

    return NextResponse.json(
      { success: true, data: sentimentResult },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to perform sentiment analysis.' },
      { status: 500 }
    );
  }
}