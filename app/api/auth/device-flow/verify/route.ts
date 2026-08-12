import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23lidMvwJpYYZlZ3K3';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_code } = body;

    if (!device_code) {
      return NextResponse.json(
        { success: false, error: 'Device code is required' },
        { status: 400 }
      );
    }

    // GitHub Device Flow - Step 2: Poll for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    });

    const data = await response.json();

    // Handle different response states
    if (data.error) {
      // authorization_pending: User hasn't completed auth yet
      // slow_down: Polling too frequently
      // expired_token: The device code has expired
      // access_denied: User denied access
      return NextResponse.json({
        success: false,
        error: data.error,
      });
    }

    if (data.access_token) {
      // Success! Get user info
      try {
        const octokit = new Octokit({ auth: data.access_token });
        const { data: user } = await octokit.rest.users.getAuthenticated();

        return NextResponse.json({
          success: true,
          access_token: data.access_token,
          user: {
            id: user.id,
            login: user.login,
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
          },
        });
      } catch (userError) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch user info' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown error occurred',
    });
  } catch (error: any) {
    console.error('Device flow verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify device code' },
      { status: 500 }
    );
  }
}
