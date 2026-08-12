import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';

export async function POST() {
  try {
    // Check if GitHub Client ID is configured
    if (!GITHUB_CLIENT_ID) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GitHub authentication is not configured. Please set GITHUB_CLIENT_ID in your environment variables.',
          needsSetup: true
        },
        { status: 400 }
      );
    }

    // GitHub Device Flow - Step 1: Request device and user codes
    const response = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        scope: 'public_repo read:user user:email',
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { success: false, error: data.error_description || data.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      device_code: data.device_code,
      user_code: data.user_code,
      verification_uri: data.verification_uri,
      expires_in: data.expires_in,
      interval: data.interval,
    });
  } catch (error: any) {
    console.error('Device flow start error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start device flow' },
      { status: 500 }
    );
  }
}
