import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    console.log('Speech-to-text request received');
    
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      console.error('No audio file provided in the request');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`Received audio file: size=${audioFile.size} bytes, type=${audioFile.type}`);
    
    if (audioFile.size === 0) {
      console.error('Empty audio file received');
      return NextResponse.json(
        { error: 'Empty audio file' },
        { status: 400 }
      );
    }

    // Create a file object that OpenAI can accept
    // Keep the webm format which is better supported by Whisper
    const audioFileObj = new File([audioFile], 'recording.webm', {
      type: 'audio/webm',
    });
    
    console.log('Converting audio for OpenAI Whisper API...');

    // Add diagnostic information
    try {
      const buffer = await audioFile.arrayBuffer();
      console.log(`Audio buffer size: ${buffer.byteLength} bytes`);
      
      // Check if buffer contains audio data (should have non-zero values)
      const dataView = new DataView(buffer);
      let nonZeroCount = 0;
      for (let i = 0; i < Math.min(100, buffer.byteLength); i++) {
        if (dataView.getUint8(i) !== 0) nonZeroCount++;
      }
      console.log(`First 100 bytes contain ${nonZeroCount} non-zero values`);
    } catch (error) {
      console.error('Error checking audio buffer:', error);
    }

    console.log('Sending audio to OpenAI Whisper API for transcription...');
    
    // Transcribe the audio using OpenAI's Whisper model
    const transcription = await openai.audio.transcriptions.create({
      file: audioFileObj,
      model: 'whisper-1',
      language: 'en',
    });

    console.log('Transcription received:', transcription.text.substring(0, 50) + '...');
    
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    
    // More detailed error handling
    let errorMessage = 'Failed to transcribe audio';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for OpenAI API specific errors
      if ('status' in error && typeof (error as any).status === 'number') {
        statusCode = (error as any).status;
      }
      
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 