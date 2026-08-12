import { getOctokit, handleGitHubError } from './client';
import { GitHubIssue } from '../types';

export interface IssueSearchFilters {
  query?: string;
  language?: string;
  repository?: string; // owner/repo
  label?: string;
  isGoodFirstIssue?: boolean;
  isHelpWanted?: boolean;
  isDocumentation?: boolean;
  sort?: 'created' | 'updated' | 'comments';
  page?: number;
  perPage?: number;
}

export interface IssueSearchResult {
  issues: GitHubIssue[];
  totalCount: number;
  error?: string;
  isRateLimited?: boolean;
}

/**
 * Searches public open GitHub issues across repositories
 */
export async function searchIssues(
  filters: IssueSearchFilters = {}
): Promise<IssueSearchResult> {
  const octokit = getOctokit();
  const page = filters.page || 1;
  const perPage = filters.perPage || 12;

  const queryParts: string[] = ['type:issue', 'state:open'];

  if (filters.query?.trim()) {
    queryParts.push(filters.query.trim());
  }

  if (filters.repository?.trim()) {
    queryParts.push(`repo:${filters.repository.trim()}`);
  }

  if (filters.language?.trim()) {
    queryParts.push(`language:${filters.language.trim()}`);
  }

  if (filters.isGoodFirstIssue) {
    queryParts.push('label:"good first issue"');
  }

  if (filters.isHelpWanted) {
    queryParts.push('label:"help wanted"');
  }

  if (filters.isDocumentation) {
    queryParts.push('label:documentation');
  }

  if (filters.label?.trim() && !filters.isGoodFirstIssue && !filters.isHelpWanted && !filters.isDocumentation) {
    queryParts.push(`label:"${filters.label.trim()}"`);
  }

  const q = queryParts.join(' ');
  const sortParam = filters.sort || 'updated';

  try {
    const res = await octokit.rest.search.issuesAndPullRequests({
      q,
      sort: sortParam,
      order: 'desc',
      page,
      per_page: perPage,
      headers: {
        'x-github-api-version': '2022-11-28',
      },
    });

    const issues: GitHubIssue[] = res.data.items.map((item) => {
      // Extract owner/repo from repository_url: "https://api.github.com/repos/owner/repo"
      const urlParts = item.repository_url.split('/');
      const repoName = urlParts.pop() || '';
      const repoOwner = urlParts.pop() || '';

      return {
        id: item.id,
        number: item.number,
        title: item.title,
        body: item.body || null,
        state: item.state,
        htmlUrl: item.html_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        commentsCount: item.comments,
        labels: item.labels.map((l: any) => ({
          id: l.id,
          name: l.name || '',
          color: l.color || '22c55e',
          description: l.description || undefined,
        })),
        author: {
          login: item.user?.login || 'ghost',
          avatarUrl: item.user?.avatar_url || '',
        },
        repository: {
          owner: repoOwner,
          name: repoName,
          fullName: `${repoOwner}/${repoName}`,
        },
      };
    });

    return {
      issues,
      totalCount: res.data.total_count,
    };
  } catch (error) {
    const errState = handleGitHubError(error);
    return {
      issues: [],
      totalCount: 0,
      error: errState.message,
      isRateLimited: errState.isRateLimited,
    };
  }
}

/**
 * Fetches single issue details with repository metadata
 */
export async function getIssueDetails(owner: string, repo: string, issueNumber: number) {
  const octokit = getOctokit();

  try {
    const [issueRes, repoRes] = await Promise.all([
      octokit.rest.issues.get({ owner, repo, issue_number: issueNumber }),
      octokit.rest.repos.get({ owner, repo }).catch(() => ({ data: null })),
    ]);

    const item = issueRes.data;
    const repoData = repoRes.data;

    const issue: GitHubIssue = {
      id: item.id,
      number: item.number,
      title: item.title,
      body: item.body || null,
      state: item.state,
      htmlUrl: item.html_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      commentsCount: item.comments,
      labels: item.labels.map((l: any) => ({
        id: typeof l === 'string' ? 0 : l.id,
        name: typeof l === 'string' ? l : l.name || '',
        color: typeof l === 'string' ? '22c55e' : l.color || '22c55e',
        description: typeof l === 'string' ? undefined : l.description || undefined,
      })),
      author: {
        login: item.user?.login || 'ghost',
        avatarUrl: item.user?.avatar_url || '',
      },
      repository: {
        owner,
        name: repo,
        fullName: `${owner}/${repo}`,
        description: repoData?.description,
        stars: repoData?.stargazers_count,
        language: repoData?.language,
      },
    };

    return { issue, error: undefined };
  } catch (error) {
    const errState = handleGitHubError(error);
    return { issue: null, error: errState.message, isRateLimited: errState.isRateLimited };
  }
}
