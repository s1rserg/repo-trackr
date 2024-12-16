import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";

import { GithubApiPath } from "./libs/enums/enums.js";
import { type CommitDto, type CommitResponseDto } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	serverUrl: string;
};

// Type definitions for the enriched issue data
interface GithubUser {
	login: string;
	name: string | null;
}

interface GithubIssueResponse {
	number: number;
	user: { login: string; url: string }; // creator
	assignee: { login: string; url: string } | null; // assignee
	title: string;
	body: string;
	state: string;
	closed_at: string | null;
	reactions: { total_count: number };
	subissues?: any[]; // Adjust if sub-issues are part of your structure
	comments: number;
}

interface EnrichedGithubIssue {
	number: number;
	creatorLogin: string;
	assigneeLogin: string | null;
	creatorName: string;
	assigneeName: string | null;
	title: string;
	body: string;
	state: string;
	closedAt: string | null;
	reactionsTotalCount: number;
	subIssuesTotalCount: number;
	commentsCount: number;
}

class AnalyticsApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, serverUrl }: Constructor) {
		super({ baseUrl, http, path: "", serverUrl });
	}

	public async fetchCommits(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<CommitResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(
				GithubApiPath.REPOS,
				"/",
				repositoryUrl,
				GithubApiPath.COMMITS,
				{},
			),
			{
				authToken,
				method: "GET",
				query: {
					since,
				},
			},
		);

		const commits: CommitResponseDto = await response.json();

		for (const commitItem of commits) {
			const detailedResponse = await this.load(
				this.getFullEndpoint(
					GithubApiPath.REPOS,
					"/",
					repositoryUrl,
					GithubApiPath.COMMITS,
					"/",
					commitItem.sha,
					{},
				),
				{
					authToken,
					method: "GET",
				},
			);
			const detailedCommit: CommitDto = await detailedResponse.json();
			commitItem.stats = detailedCommit.stats;
		}

		return commits;
	}

	public async fetchIssues(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<EnrichedGithubIssue[]> {
		const response = await this.load(
			this.getFullEndpoint(
				GithubApiPath.REPOS,
				"/",
				repositoryUrl,
				GithubApiPath.ISSUES,
				{},
			),
			{
				authToken,
				method: "GET",
				query: {
					since,
				},
			},
		);

		const issues: GithubIssueResponse[] = await response.json();

		const enrichedIssues: EnrichedGithubIssue[] = [];

		for (const issue of issues) {
			const creatorLogin = issue.user.login;
			const assigneeLogin = issue.assignee ? issue.assignee.login : null;

			// Fetch creator details (name)
			const creatorResponse = await this.load(issue.user.url, {
				authToken,
				method: "GET",
			});
			const creatorDetails: GithubUser = await creatorResponse.json();
			const creatorName = creatorDetails.name || creatorLogin;

			let assigneeName: string | null = null;

			if (assigneeLogin && issue.assignee) {
				const assigneeResponse = await this.load(issue.assignee.url, {
					authToken,
					method: "GET",
				});
				const assigneeDetails: GithubUser = await assigneeResponse.json();
				assigneeName = assigneeDetails.name || assigneeLogin;
			}

			enrichedIssues.push({
				number: issue.number,
				creatorLogin,
				assigneeLogin,
				creatorName,
				assigneeName,
				title: issue.title,
				body: issue.body,
				state: issue.state,
				closedAt: issue.closed_at,
				reactionsTotalCount: issue.reactions.total_count,
				subIssuesTotalCount: issue.subissues ? issue.subissues.length : 0, // Assuming subissues are nested
				commentsCount: issue.comments,
			});
		}

		return enrichedIssues;
	}
}

export { AnalyticsApi };
