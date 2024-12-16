import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";

import { GithubApiPath } from "./libs/enums/enums.js";
import { type CommitDto, type CommitResponseDto } from "./libs/types/types.js";
import {
	type PullCreateItemRequestDto,
	type IssueCreateItemRequestDto,
} from "~/libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	serverUrl: string;
};

interface GithubUser {
	login: string;
	name: string | null;
}

interface GithubIssueResponse {
	number: number;
	user: { login: string };
	assignee: { login: string } | null;
	title: string;
	body: string;
	state: string;
	closed_at: string | null;
	reactions: { total_count: number };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	subissues?: any[];
	comments: number;
	created_at: string;
	updated_at: string;
}

interface GithubPullResponse {
	number: number;
	user: { login: string };
	assignee: { login: string } | null;
	title: string;
	body: string;
	state: string;
	closed_at: string | null;
	merged_at: string | null;
	comments: number;
	created_at: string;
	updated_at: string;
	draft: boolean;
}

interface GithubPullItemResponse {
	commentsCount: number;
	reviewCommentsCount: number;
	additions: number;
	deletions: number;
	commits: number;
	changedFiles: number;
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
	): Promise<IssueCreateItemRequestDto[]> {
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

		const enrichedIssues: IssueCreateItemRequestDto[] = [];

		for (const issue of issues) {
			const creatorLogin = issue.user.login;
			const assigneeLogin = issue.assignee ? issue.assignee.login : null;

			// Fetch creator details (name)
			const creatorResponse = await this.load(
				this.getFullEndpoint(GithubApiPath.USERS, "/", issue.user.login, {}),
				{
					authToken,
					method: "GET",
				},
			);
			const creatorDetails: GithubUser = await creatorResponse.json();
			const creatorName = creatorDetails.name || creatorLogin;

			let assigneeName: string | null = null;

			if (assigneeLogin && issue.assignee) {
				const assigneeResponse = await this.load(
					this.getFullEndpoint(
						GithubApiPath.USERS,
						"/",
						issue.assignee.login,
						{},
					),
					{
						authToken,
						method: "GET",
					},
				);
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
				createdAt: issue.created_at,
				updatedAt: issue.updated_at,
			});
		}

		return enrichedIssues;
	}

	public async fetchPulls(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<PullCreateItemRequestDto[]> {
		const response = await this.load(
			this.getFullEndpoint(
				GithubApiPath.REPOS,
				"/",
				repositoryUrl,
				GithubApiPath.PULLS,
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

		const pulls: GithubPullResponse[] = await response.json();

		const enrichedPulls: PullCreateItemRequestDto[] = [];

		for (const pull of pulls) {
			const creatorLogin = pull.user.login;
			const assigneeLogin = pull.assignee ? pull.assignee.login : null;

			// Fetch creator details (name)
			const creatorResponse = await this.load(
				this.getFullEndpoint(GithubApiPath.USERS, "/", pull.user.login, {}),
				{
					authToken,
					method: "GET",
				},
			);
			const creatorDetails: GithubUser = await creatorResponse.json();
			const creatorName = creatorDetails.name || creatorLogin;

			let assigneeName: string | null = null;

			if (assigneeLogin && pull.assignee) {
				const assigneeResponse = await this.load(
					this.getFullEndpoint(
						GithubApiPath.USERS,
						"/",
						pull.assignee.login,
						{},
					),
					{
						authToken,
						method: "GET",
					},
				);
				const assigneeDetails: GithubUser = await assigneeResponse.json();
				assigneeName = assigneeDetails.name || assigneeLogin;
			}

			const pullDetailsResponse = await this.load(
				this.getFullEndpoint(
					GithubApiPath.REPOS,
					"/",
					repositoryUrl,
					GithubApiPath.PULLS,
					"/",
					pull.number.toString(),
					{},
				),
				{
					authToken,
					method: "GET",
				},
			);

			const pullDetails: GithubPullItemResponse =
				await pullDetailsResponse.json();

			enrichedPulls.push({
				number: pull.number,
				creatorLogin,
				assigneeLogin,
				creatorName,
				assigneeName,
				title: pull.title,
				body: pull.body,
				state: pull.state,
				closedAt: pull.closed_at,
				createdAt: pull.created_at,
				updatedAt: pull.updated_at,
				mergedAt: pull.merged_at,
				draft: pull.draft,
				commentsCount: pullDetails.commentsCount,
				reviewCommentsCount: pullDetails.reviewCommentsCount,
				additions: pullDetails.additions,
				deletions: pullDetails.deletions,
				commits: pullDetails.commits,
				changedFiles: pullDetails.changedFiles,
			});
		}

		return enrichedPulls;
	}
}

export { AnalyticsApi };
