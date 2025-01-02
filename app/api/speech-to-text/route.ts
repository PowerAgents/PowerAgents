import { NextResponse } from 'next/server';

const OPENAI_API_KEY = `${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: file.type }), file.name);
        formData.append('model', 'whisper-1');
        return formData;
      })(),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in speech-to-text API:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}

