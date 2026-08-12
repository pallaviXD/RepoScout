import { Octokit } from '@octokit/rest';

export interface ForkRepositoryResult {
  success: boolean;
  forkUrl?: string;
  cloneUrl?: string;
  error?: string;
}

export interface CloneInstructions {
  httpsUrl: string;
  sshUrl: string;
  ghCliCommand: string;
  terminalCommands: string[];
}

/**
 * Fork a repository using authenticated user's token
 */
export async function forkRepository(
  owner: string,
  repo: string,
  userAccessToken: string
): Promise<ForkRepositoryResult> {
  try {
    const octokit = new Octokit({ auth: userAccessToken });

    const response = await octokit.rest.repos.createFork({
      owner,
      repo,
    });

    return {
      success: true,
      forkUrl: response.data.html_url,
      cloneUrl: response.data.clone_url,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fork repository',
    };
  }
}

/**
 * Get clone instructions for a repository
 */
export function getCloneInstructions(
  owner: string,
  repo: string,
  userForkOwner?: string
): CloneInstructions {
  const repoToClone = userForkOwner ? `${userForkOwner}/${repo}` : `${owner}/${repo}`;
  
  return {
    httpsUrl: `https://github.com/${repoToClone}.git`,
    sshUrl: `git@github.com:${repoToClone}.git`,
    ghCliCommand: `gh repo clone ${repoToClone}`,
    terminalCommands: [
      `# Clone the repository`,
      `git clone https://github.com/${repoToClone}.git`,
      `cd ${repo}`,
      ``,
      `# Create a new branch for your changes`,
      `git checkout -b fix/issue-name`,
      ``,
      `# After making changes, commit and push`,
      `git add .`,
      `git commit -m "Your commit message"`,
      `git push origin fix/issue-name`,
    ],
  };
}

/**
 * Get setup instructions for working on a specific issue
 */
export function getIssueWorkflowInstructions(
  owner: string,
  repo: string,
  issueNumber: number,
  issueTitle: string,
  userForkOwner?: string
): string[] {
  const repoToClone = userForkOwner ? `${userForkOwner}/${repo}` : `${owner}/${repo}`;
  const branchName = `fix/issue-${issueNumber}`;
  
  return [
    `# 1. Fork and Clone the Repository`,
    `git clone https://github.com/${repoToClone}.git`,
    `cd ${repo}`,
    ``,
    `# 2. Add upstream remote (original repo)`,
    `git remote add upstream https://github.com/${owner}/${repo}.git`,
    ``,
    `# 3. Create a new branch for this issue`,
    `git checkout -b ${branchName}`,
    ``,
    `# 4. Make your changes to fix the issue`,
    `# Edit files, write code, add tests...`,
    ``,
    `# 5. Commit your changes`,
    `git add .`,
    `git commit -m "Fix: ${issueTitle.replace(/"/g, '\\"')} (#${issueNumber})"`,
    ``,
    `# 6. Push to your fork`,
    `git push origin ${branchName}`,
    ``,
    `# 7. Create a Pull Request`,
    `# Go to https://github.com/${owner}/${repo}/compare`,
    `# Select your branch and create the PR`,
    ``,
    `# 8. Keep your branch updated with upstream`,
    `git fetch upstream`,
    `git rebase upstream/main`,
  ];
}

/**
 * Check if user has already forked a repository
 */
export async function checkUserFork(
  owner: string,
  repo: string,
  username: string,
  userAccessToken: string
): Promise<{ hasFork: boolean; forkUrl?: string }> {
  try {
    const octokit = new Octokit({ auth: userAccessToken });

    const response = await octokit.rest.repos.get({
      owner: username,
      repo: repo,
    });

    // Check if this is actually a fork of the target repo
    if (response.data.fork && response.data.parent?.full_name === `${owner}/${repo}`) {
      return {
        hasFork: true,
        forkUrl: response.data.html_url,
      };
    }

    return { hasFork: false };
  } catch (error: any) {
    // 404 means no fork exists
    if (error.status === 404) {
      return { hasFork: false };
    }
    return { hasFork: false };
  }
}
