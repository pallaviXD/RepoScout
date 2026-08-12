import { Octokit } from '@octokit/rest';

/**
 * Singleton Octokit instance.
 * Automatically checks process.env.GITHUB_TOKEN.
 * If GITHUB_TOKEN is absent, falls back to unauthenticated GitHub API (60 reqs/hr rate limit).
 * Handles errors, rate limits, and network issues gracefully without throwing unhandled exceptions.
 */
export function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN?.trim();

  return new Octokit({
    auth: token || undefined,
    userAgent: 'RepoScout/1.0.0',
  });
}

export interface ApiErrorState {
  isError: boolean;
  isRateLimited: boolean;
  message: string;
}

export function handleGitHubError(error: any): ApiErrorState {
  console.error('GitHub API Request Error:', error?.message || error);

  const status = error?.status || error?.response?.status;
  if (status === 403 || status === 429 || error?.message?.includes('rate limit')) {
    return {
      isError: true,
      isRateLimited: true,
      message: 'GitHub public API rate limit reached. Please try again later or add GITHUB_TOKEN for higher rate limits.',
    };
  }

  if (status === 404) {
    return {
      isError: true,
      isRateLimited: false,
      message: 'Requested GitHub resource or repository was not found.',
    };
  }

  return {
    isError: true,
    isRateLimited: false,
    message: error?.message || 'Unable to communicate with GitHub API right now. Please try again.',
  };
}
