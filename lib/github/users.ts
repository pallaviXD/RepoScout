import { getOctokit, handleGitHubError } from './client';

export interface GitHubUserProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
  createdAt: string;
}

export async function getGitHubUserProfile(username: string) {
  const octokit = getOctokit();

  try {
    const res = await octokit.rest.users.getByUsername({ username });
    const u = res.data;

    const profile: GitHubUserProfile = {
      username: u.login,
      name: u.name,
      avatarUrl: u.avatar_url,
      bio: u.bio,
      publicRepos: u.public_repos,
      followers: u.followers,
      following: u.following,
      htmlUrl: u.html_url,
      createdAt: u.created_at,
    };

    return { profile, error: undefined };
  } catch (error) {
    const errState = handleGitHubError(error);
    return { profile: null, error: errState.message };
  }
}
