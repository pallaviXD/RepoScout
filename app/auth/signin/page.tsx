'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  
  const [step, setStep] = useState<'initial' | 'code' | 'verifying' | 'success'>('initial');
  const [deviceCode, setDeviceCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [verificationUri, setVerificationUri] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const startOAuthFlow = () => {
    // Redirect to GitHub OAuth directly
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23liDZYlFYsg8fFlbr'}&scope=public_repo read:user user:email&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/callback/github')}&state=${callbackUrl}`;
    window.location.href = githubAuthUrl;
  };

  const startDeviceFlow = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/device-flow/start', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setDeviceCode(data.device_code);
        setUserCode(data.user_code);
        setVerificationUri(data.verification_uri);
        setStep('code');
        
        // Start polling for verification
        pollForVerification(data.device_code, data.interval || 5);
      } else {
        // Check if setup is needed
        if (data.needsSetup) {
          setError('GitHub authentication is not set up. Using public mode.');
          // Redirect to explore page after 2 seconds
          setTimeout(() => {
            window.location.href = '/explore';
          }, 2000);
        } else if (data.error === 'slow_down') {
          // Polling too fast, increase interval
          setError('Please wait a moment before trying again...');
          setTimeout(() => {
            setError('');
            setStep('initial');
          }, 3000);
        } else {
          setError(data.error || 'Failed to start sign-in process');
        }
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollForVerification = async (deviceCode: string, interval: number) => {
    setStep('verifying');

    const poll = async () => {
      try {
        const response = await fetch('/api/auth/device-flow/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_code: deviceCode }),
        });

        const data = await response.json();

        if (data.success && data.access_token) {
          // Store token and user info
          localStorage.setItem('github_token', data.access_token);
          localStorage.setItem('github_user', JSON.stringify(data.user));
          
          setStep('success');
          
          // Redirect after short delay
          setTimeout(() => {
            window.location.href = callbackUrl;
          }, 1500);
          
          return true; // Stop polling
        } else if (data.error === 'authorization_pending') {
          // Still waiting, continue polling
          return false;
        } else if (data.error === 'expired_token') {
          setError('Verification code expired. Please try again.');
          setStep('initial');
          return true; // Stop polling
        } else if (data.error === 'access_denied') {
          setError('You denied the authorization request.');
          setStep('initial');
          return true; // Stop polling
        } else {
          setError(data.error || 'Verification failed');
          setStep('initial');
          return true; // Stop polling
        }
      } catch (err) {
        return false; // Continue polling on error
      }
    };

    // Poll every X seconds
    const intervalId = setInterval(async () => {
      const shouldStop = await poll();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, interval * 1000);

    // Initial poll
    poll();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(userCode);
  };

  const openGitHub = () => {
    window.open(verificationUri, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Sign in to RepoScout</h1>
            <p className="text-gray-600 text-sm">
              {step === 'initial' && 'Secure device authentication with GitHub'}
              {step === 'code' && 'Enter the code on GitHub to continue'}
              {step === 'verifying' && 'Waiting for your confirmation...'}
              {step === 'success' && 'Successfully authenticated!'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Initial Step */}
          {step === 'initial' && (
            <div className="space-y-4">
              <button
                onClick={startOAuthFlow}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Quick & Easy:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Click "Continue with GitHub"</li>
                      <li>Authorize RepoScout on GitHub</li>
                      <li>You'll be signed in automatically!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Code Step */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 text-center">
                <p className="text-sm text-blue-900 font-semibold mb-3">Your verification code:</p>
                <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
                  <p className="text-4xl font-bold text-black tracking-[0.5em] font-mono">{userCode}</p>
                </div>
                <button
                  onClick={copyCode}
                  className="text-xs text-blue-700 hover:text-blue-900 underline font-medium"
                >
                  Click to copy code
                </button>
              </div>

              <button
                onClick={openGitHub}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-sm shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open GitHub to Continue
              </button>

              <p className="text-xs text-center text-gray-500">
                After entering the code, you'll be redirected automatically
              </p>
            </div>
          )}

          {/* Verifying Step */}
          {step === 'verifying' && (
            <div className="space-y-6 text-center py-8">
              <div className="relative">
                <div className="w-20 h-20 mx-auto">
                  <svg className="animate-spin w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Waiting for authorization...</p>
                <p className="text-sm text-gray-600">Please complete the authorization on GitHub</p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="space-y-6 text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Successfully signed in!</p>
                <p className="text-sm text-gray-600">Redirecting you now...</p>
              </div>
            </div>
          )}

          {/* Footer */}
          {step === 'initial' && (
            <div className="text-center pt-4">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue without signing in
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
