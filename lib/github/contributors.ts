import { getOctokit, handleGitHubError } from './client';

export interface RepositoryContributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export async function getRepositoryContributors(owner: string, repo: string): Promise<RepositoryContributor[]> {
  const octokit = getOctokit();

  try {
    const res = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });

    return res.data.map((c) => ({
      login: c.login || 'contributor',
      avatarUrl: c.avatar_url || '',
      contributions: c.contributions || 0,
      htmlUrl: c.html_url || `https://github.com/${c.login}`,
    }));
  } catch (error) {
    handleGitHubError(error);
    return [];
  }
}
