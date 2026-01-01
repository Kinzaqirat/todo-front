/**
 * API route for proxying chat requests to backend.
 * [Task]: T051
 * [Acceptance Criteria]: Proxies to backend /api/v1/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/chat-api';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversation_history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await sendChatMessage(
      message,
      conversation_history || []
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
