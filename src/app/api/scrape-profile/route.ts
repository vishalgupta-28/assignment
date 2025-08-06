import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_API_TOKEN;

const client = new ApifyClient({
 token: token || '',
});

export const dynamic = 'force-dynamic'; 

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
  }
  
  const { username } = body;

  if (!username || typeof username !== 'string') {
    return NextResponse.json({ message: 'The "reelUrl" parameter is required and must be a string.' }, { status: 400 });
  }

  try {
    const actorRun = await client.actor('apify/instagram-profile-scraper').call({
    "usernames": [
      username
    ]
  });

  const { items } = await client.dataset(actorRun.defaultDatasetId).listItems();
  console.dir(items);

  return NextResponse.json(
      { success: true, data: items },
      { status: 200 }
    )

  } catch (error) {
    console.error('Apify API Error:', error );
    
    // 4. Provide more specific error feedback
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to scrape the Reel via Apify.', details: error.response?.data?.error?.message || 'Unknown Apify error' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}