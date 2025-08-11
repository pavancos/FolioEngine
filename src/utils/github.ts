import { Octokit } from "octokit";
// Function to create a GitHub repository, add a README.md
export const createGithubRepo = async (octokit: Octokit, repoName: string) => {
  // Step 1: Create the repository
  const repoResponse = await octokit.request("POST /user/repos", {
    name: repoName,
    private: false,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // Step 2: Create the README.md file
  const readmeContent = `# ${repoName}\n`;
  const contentBase64 = Buffer.from(readmeContent).toString("base64");

  // Create the README.md file in the repository
  const createReadmeResponse = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repoResponse.data.owner.login,
      repo: repoName,
      path: "README.md",
      message: "Create default README.md file",
      content: contentBase64,
      branch: repoResponse.data.default_branch, // Commit on the default branch (main or master)
    }
  );

  return repoResponse.data;
};

// Function to get create inde.html and commit it to the GitHub repository
export const commitFolioToGithub = async (
  octokit: Octokit,
  repoName: string,
  repoResponse: any,
  HTMLContent: string
) => {
  // Step 3: Create index.html in the repo
  const indexHtmlContent = HTMLContent;
  const indexContentBase64 = Buffer.from(indexHtmlContent).toString("base64");

  // Create the index.html file in the repository
  const createIndexResponse = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repoResponse.owner.login,
      repo: repoName,
      path: "index.html",
      message: "Create default index.html file",
      content: indexContentBase64,
      branch: repoResponse.default_branch, // Commit on the default branch
    }
  );
};

export const publishFolioToGithub = async (
  octokit: Octokit,
  repoName: string,
  repoResponse: any
) => {
  // Step 4: Enable GitHub Pages
  const enablePagesResponse = await octokit.request(
    "POST /repos/{owner}/{repo}/pages",
    {
      owner: repoResponse.owner.login,
      repo: repoName,
      source: { branch: "main", path: "/" },
    }
  );

  // Step 5: Wait till the action is completed
  let status: any = "building";
  let maxAttempts = 20;
  let attempts = 0;

  while (status !== "built" && attempts < maxAttempts) {
    await new Promise((res) => setTimeout(res, 5000));
    const pagesStatus = await octokit.request(
      "GET /repos/{owner}/{repo}/pages",
      {
        owner: repoResponse.owner.login,
        repo: repoName,
      }
    );
    status = pagesStatus.data.status;
    attempts++;
  }

  if (status !== "built") {
    throw new Error(`GitHub Pages did not finish building (status: ${status})`);
  }

  console.log(`GitHub Pages built successfully: ${enablePagesResponse.data.html_url}`);

  return enablePagesResponse.data.html_url;
};
