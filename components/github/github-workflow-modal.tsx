'use client';

import React, { useState } from 'react';
import { X, Copy, Check, GitFork, Terminal, ExternalLink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GitHubWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
  repo: string;
  issueNumber?: number;
  issueTitle?: string;
}

export const GitHubWorkflowModal: React.FC<GitHubWorkflowModalProps> = ({
  isOpen,
  onClose,
  owner,
  repo,
  issueNumber,
  issueTitle,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'fork' | 'clone' | 'instructions' | 'success'>('fork');
  const [deviceCode, setDeviceCode] = useState('');
  const [forking, setForking] = useState(false);
  const [forkUrl, setForkUrl] = useState<string | null>(null);
  const [cloneUrl, setCloneUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleFork = async () => {
    if (!session) {
      // Redirect to sign in with return URL
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setForking(true);

    try {
      const response = await fetch('/api/github/fork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await response.json();

      if (data.success) {
        setForkUrl(data.forkUrl);
        setCloneUrl(data.cloneUrl);
        
        // Automatically try to open in GitHub Desktop or VS Code
        const userUsername = (session.user as any)?.username || session.user?.name || 'your-username';
        const forkedRepo = `${userUsername}/${repo}`;
        
        // Try GitHub Desktop first
        const githubDesktopUrl = `x-github-client://openRepo/https://github.com/${forkedRepo}`;
        window.location.href = githubDesktopUrl;
        
        // Show success and next steps
        setStep('success');
        
        // Also prepare VS Code URL as backup
        setTimeout(() => {
          const vscodeUrl = `vscode://vscode.git/clone?url=https://github.com/${forkedRepo}.git`;
          // Store for user to click if GitHub Desktop didn't work
          (window as any).vscodeUrl = vscodeUrl;
        }, 2000);
      } else {
        setError(data.error || 'Failed to fork repository');
      }
    } catch (error) {
      console.error('Fork error:', error);
      setError('An error occurred while forking the repository');
    } finally {
      setForking(false);
    }
  };

  const openInGitHubDesktop = () => {
    const userUsername = (session?.user as any)?.username || session?.user?.name || owner;
    const githubDesktopUrl = `x-github-client://openRepo/https://github.com/${userUsername}/${repo}`;
    window.location.href = githubDesktopUrl;
  };

  const openInVSCode = () => {
    const userUsername = (session?.user as any)?.username || session?.user?.name || owner;
    const vscodeUrl = `vscode://vscode.git/clone?url=https://github.com/${userUsername}/${repo}.git`;
    window.location.href = vscodeUrl;
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const username = (session?.user as any)?.username || session?.user?.name || 'your-username';
  const repoToClone = forkUrl ? `${username}/${repo}` : `${owner}/${repo}`;
  const branchName = issueNumber ? `fix/issue-${issueNumber}` : 'feature/your-feature';

  const cloneCommands = [
    `# Clone your forked repository`,
    `git clone https://github.com/${repoToClone}.git`,
    `cd ${repo}`,
  ];

  const setupCommands = [
    `# Add upstream remote (original repo)`,
    `git remote add upstream https://github.com/${owner}/${repo}.git`,
    ``,
    `# Create a new branch for your work`,
    `git checkout -b ${branchName}`,
    ``,
    `# Make your changes, then commit`,
    `git add .`,
    issueNumber && issueTitle
      ? `git commit -m "Fix: ${issueTitle} (#${issueNumber})"`
      : `git commit -m "Your commit message"`,
    ``,
    `# Push to your fork`,
    `git push origin ${branchName}`,
    ``,
    `# Then create a Pull Request on GitHub`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {step === 'fork' && 'Fork & Clone Repository'}
              {step === 'clone' && 'Clone Your Fork'}
              {step === 'instructions' && 'Setup Instructions'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {owner}/{repo}
              {issueNumber && ` - Issue #${issueNumber}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'fork' && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GitFork className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 text-lg mb-2">
                      {!session ? 'Sign in to GitHub' : 'Fork to Your Account'}
                    </h3>
                    <p className="text-sm text-blue-800">
                      {!session ? (
                        <>
                          Sign in with your GitHub account to automatically fork this repository and open it in GitHub Desktop or VS Code with one click.
                        </>
                      ) : (
                        <>
                          We'll fork <strong>{owner}/{repo}</strong> to your GitHub account and help you open it locally for development.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                {!session ? (
                  <button
                    onClick={() => router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`)}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-sm shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Sign in with GitHub
                  </button>
                ) : (
                  <button
                    onClick={handleFork}
                    disabled={forking}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forking ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Forking & Setting Up...
                      </>
                    ) : (
                      <>
                        <GitFork className="w-5 h-5" />
                        Fork & Open Locally
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Sign In</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Auto Fork</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Open Local</p>
                </div>
              </div>
            </div>
          )}

          {step === 'clone' && (
            <div className="space-y-6">
              {forkUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <strong>Repository forked successfully!</strong>
                  </p>
                  <a
                    href={forkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1 mt-2"
                  >
                    View your fork <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      Clone Command
                    </h3>
                    <button
                      onClick={() => copyToClipboard(cloneCommands.join('\n'), 'clone')}
                      className="text-xs text-gray-600 hover:text-black flex items-center gap-1"
                    >
                      {copied === 'clone' ? (
                        <>
                          <Check className="w-3 h-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {cloneCommands.join('\n')}
                  </pre>
                </div>

                <button
                  onClick={() => setStep('instructions')}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Next: Setup Instructions →
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <strong>Repository forked successfully!</strong>
                </p>
                {forkUrl && (
                  <a
                    href={forkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1 mt-2"
                  >
                    View your fork on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 text-center">
                  Choose how to open this repository:
                </p>

                <button
                  onClick={openInGitHubDesktop}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Open in GitHub Desktop
                </button>

                <button
                  onClick={openInVSCode}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                  </svg>
                  Open in VS Code
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('instructions')}
                  className="w-full py-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  View manual setup instructions
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-900">
                  <strong>Note:</strong> If the buttons above don't work, you may need to install{' '}
                  <a href="https://desktop.github.com/" target="_blank" rel="noopener noreferrer" className="underline">
                    GitHub Desktop
                  </a>{' '}
                  or{' '}
                  <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="underline">
                    VS Code
                  </a>.
                </p>
              </div>
            </div>
          )}

          {step === 'instructions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Complete Workflow:</strong> Follow these commands to set up your
                  development environment and submit your contribution.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Full Setup & Contribution Workflow
                  </h3>
                  <button
                    onClick={() => copyToClipboard(setupCommands.join('\n'), 'setup')}
                    className="text-xs text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    {copied === 'setup' ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy All
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {setupCommands.join('\n')}
                </pre>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>Next Steps:</strong> After pushing your changes, go to{' '}
                  <a
                    href={`https://github.com/${owner}/${repo}/compare`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-700"
                  >
                    {owner}/{repo}
                  </a>{' '}
                  to create your Pull Request.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={step === 'fork' ? 'text-black font-semibold' : ''}>1. Fork</span>
            <span>→</span>
            <span className={step === 'clone' ? 'text-black font-semibold' : ''}>2. Clone</span>
            <span>→</span>
            <span className={step === 'instructions' ? 'text-black font-semibold' : ''}>
              3. Setup
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
