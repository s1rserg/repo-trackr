const GithubApiPath = {
	REPOS: "/repos",
	COMMITS: "/commits",
	ISSUES: "/issues",
	PULLS: "/pulls",
	USERS: "/users",
	ISSUES_COMMENTS: "/issues/comments",
	PULLS_COMMENTS: "/pulls/comments",
} as const;

export { GithubApiPath };
