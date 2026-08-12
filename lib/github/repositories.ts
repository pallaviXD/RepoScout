import { getOctokit, handleGitHubError } from './client';
import { GitHubRepository } from '../types';

export interface RepositorySearchFilters {
  query?: string;
  language?: string;
  minStars?: number;
  minForks?: number;
  topic?: string;
  activeOnly?: boolean;
  goodFirstIssuesOnly?: boolean;
  sort?: 'stars' | 'updated' | 'forks' | 'best-match';
  page?: number;
  perPage?: number;
}

export interface RepositorySearchResult {
  repositories: GitHubRepository[];
  totalCount: number;
  error?: string;
  isRateLimited?: boolean;
}

/**
 * Searches public GitHub repositories with filtering and caching
 */
export async function searchRepositories(
  filters: RepositorySearchFilters = {}
): Promise<RepositorySearchResult> {
  const octokit = getOctokit();
  const page = filters.page || 1;
  const perPage = filters.perPage || 12;

  // Build GitHub Search Query String
  const queryParts: string[] = [];
  if (filters.query?.trim()) {
    queryParts.push(filters.query.trim());
  } else {
    queryParts.push('stars:>100'); // Default popular repo search if query empty
  }

  if (filters.language) {
    queryParts.push(`language:${filters.language}`);
  }
  if (filters.minStars) {
    queryParts.push(`stars:>=${filters.minStars}`);
  }
  if (filters.minForks) {
    queryParts.push(`forks:>=${filters.minForks}`);
  }
  if (filters.topic) {
    queryParts.push(`topic:${filters.topic}`);
  }
  if (filters.goodFirstIssuesOnly) {
    queryParts.push('good-first-issues:>0');
  }
  if (filters.activeOnly) {
    // Repos updated in last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    queryParts.push(`pushed:>${ninetyDaysAgo}`);
  }

  const q = queryParts.join(' ');

  let sortParam: 'stars' | 'forks' | 'updated' | undefined = undefined;
  if (filters.sort === 'stars') sortParam = 'stars';
  else if (filters.sort === 'forks') sortParam = 'forks';
  else if (filters.sort === 'updated') sortParam = 'updated';

  try {
    const res = await octokit.rest.search.repos({
      q,
      sort: sortParam,
      order: 'desc',
      page,
      per_page: perPage,
      headers: {
        'x-github-api-version': '2022-11-28',
      },
    });

    const repositories: GitHubRepository[] = res.data.items.map((item) => ({
      id: item.id,
      name: item.name,
      fullName: item.full_name,
      owner: {
        login: item.owner?.login || '',
        avatarUrl: item.owner?.avatar_url || '',
      },
      description: item.description,
      stars: item.stargazers_count,
      forks: item.forks_count,
      openIssuesCount: item.open_issues_count,
      language: item.language,
      topics: item.topics || [],
      updatedAt: item.updated_at,
      pushedAt: item.pushed_at,
      htmlUrl: item.html_url,
      hasGoodFirstIssues: (item.open_issues_count || 0) > 0,
      isActive: item.pushed_at ? new Date(item.pushed_at).getTime() > Date.now() - 90 * 86400000 : true,
    }));

    return {
      repositories,
      totalCount: res.data.total_count,
    };
  } catch (error) {
    const errState = handleGitHubError(error);
    return {
      repositories: [],
      totalCount: 0,
      error: errState.message,
      isRateLimited: errState.isRateLimited,
    };
  }
}

/**
 * Fetches single repository detailed information by owner and repo name
 */
export async function getRepositoryDetails(owner: string, repo: string) {
  const octokit = getOctokit();

  try {
    const [repoRes, languagesRes, commitsRes] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.repos.listLanguages({ owner, repo }).catch(() => ({ data: {} })),
      octokit.rest.repos.listCommits({ owner, repo, per_page: 5 }).catch(() => ({ data: [] })),
    ]);

    const data = repoRes.data;

    // Calculate language percentages
    const languagesRaw = languagesRes.data as Record<string, number>;
    const totalBytes = Object.values(languagesRaw).reduce((acc, bytes) => acc + bytes, 0);
    const languagesBreakdown = Object.entries(languagesRaw).map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    }));

    const recentCommits = (commitsRes.data as any[]).map((c) => ({
      sha: c.sha?.substring(0, 7),
      message: c.commit?.message?.split('\n')[0] || '',
      author: c.commit?.author?.name || c.author?.login || 'Contributor',
      avatarUrl: c.author?.avatar_url || '',
      date: c.commit?.author?.date || '',
    }));

    const repository: GitHubRepository = {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      owner: {
        login: data.owner.login,
        avatarUrl: data.owner.avatar_url,
      },
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssuesCount: data.open_issues_count,
      language: data.language,
      topics: data.topics || [],
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
      htmlUrl: data.html_url,
      isActive: data.pushed_at ? new Date(data.pushed_at).getTime() > Date.now() - 90 * 86400000 : true,
    };

    return {
      repository,
      languagesBreakdown,
      recentCommits,
      error: undefined,
    };
  } catch (error) {
    const errState = handleGitHubError(error);
    return {
      repository: null,
      languagesBreakdown: [],
      recentCommits: [],
      error: errState.message,
      isRateLimited: errState.isRateLimited,
    };
  }
}
