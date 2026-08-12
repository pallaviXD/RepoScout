import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      );
    }

    // Verify the token by fetching user info
    try {
      const octokit = new Octokit({ auth: token });
      const { data: user } = await octokit.rest.users.getAuthenticated();

      // Return user info if token is valid
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          login: user.login,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          bio: user.bio,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid GitHub token. Please check and try again.' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('GitHub token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}
