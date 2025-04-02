import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET || !process.env.LIVEKIT_WS_URL) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { roomName, participantName } = await req.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'Missing roomName or participantName' },
        { status: 400 }
      );
    }

    // Create access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        name: participantName,
      }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // Create agent token
    const agentAt = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { 
        identity: 'agent',
        name: 'Interview Agent'
      }
    );

    agentAt.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const agentToken = await agentAt.toJwt();

    return NextResponse.json({
      token,
      agentToken,
      roomName,
      wsUrl: process.env.LIVEKIT_WS_URL,
    });
  } catch (error) {
    console.error('Error in /api/agent:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 