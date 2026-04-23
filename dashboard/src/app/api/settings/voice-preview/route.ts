import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const PREVIEW_TEXT = "Hi, this is Amy from Amy Solutions. I answer every call, book appointments, and make sure your business never misses an opportunity. How can I help you today?";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!ELEVENLABS_API_KEY) return NextResponse.json({ error: 'Voice preview not configured' }, { status: 503 });

  const { voiceId } = await req.json() as { voiceId: string };
  if (!voiceId) return NextResponse.json({ error: 'voiceId required' }, { status: 400 });

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: PREVIEW_TEXT,
        model_id: 'eleven_flash_v2_5',
        voice_settings: { stability: 0.75, similarity_boost: 0.82, speed: 0.92 },
      }),
    });

    if (!res.ok) return NextResponse.json({ error: 'Voice preview failed' }, { status: 502 });

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audio.byteLength),
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
