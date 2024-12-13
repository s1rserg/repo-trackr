import { formatDate } from "~/libs/helpers/helpers.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { type analyticsApi } from "./analytics.js";
import {
	type ActivityLogCreateItemRequestDto,
	type CommitStatistics,
} from "./libs/types/types.js";

type Constructor = {
	analyticsApi: typeof analyticsApi;
	apiKey: string;
	repoPath: string;
	userId: string;
};

class AnalyticsService {
	private analyticsApi: typeof analyticsApi;
	private apiKey: string;
	private repoPath: string;
	private userId: string;

	public constructor({
		analyticsApi,
		apiKey,
		repoPath,
		userId,
	}: Constructor) {
		this.analyticsApi = analyticsApi;
		this.apiKey = apiKey;
		this.repoPath = repoPath;
		this.userId = userId;
	}

	public async groupCommitsByAuthor(
		authToken: string,
		repositoryUrl: string,
		since: string
	): Promise<ActivityLogCreateItemRequestDto> {
		// Fetch the commits
		const commits = await this.analyticsApi.fetchCommits(authToken, repositoryUrl, since);
	
		// Create a map to group commits by author
		const commitsByAuthor: Record<string, { name: string; email: string; commitsNumber: number }> = {};
	
		// Iterate over the commits to populate the map
		for (const { commit } of commits) {
			const {author} = commit;
	
			if (author) {
				const { name, email, date } = author;
	
				if (!commitsByAuthor[email]) {
					commitsByAuthor[email] = {
						name,
						email,
						commitsNumber: 0,
					};
				}
	
				commitsByAuthor[email].commitsNumber += 1;
			}
		}
	
		// Format the result into ActivityLogCreateItemRequestDto
		const items = Object.values(commitsByAuthor).map(({ name, email, commitsNumber }) => ({
			authorName: name,
			authorEmail: email,
			commitsNumber,
		}));
	
		// Get the date for the activity log (use the 'since' date or a custom date logic as needed)
		return {
			date: new Date().toISOString(), // You can replace this with a more appropriate date if required
			items,
		};
	}

}

export { AnalyticsService };
