import { type analyticsApi } from "./analytics.js";
import { type ActivityLogCreateItemRequestDto } from "./libs/types/types.js";

type Constructor = {
	analyticsApi: typeof analyticsApi;
};

class AnalyticsService {
	private analyticsApi: typeof analyticsApi;

	public constructor({ analyticsApi }: Constructor) {
		this.analyticsApi = analyticsApi;
	}

	public async groupCommitsByAuthor(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<ActivityLogCreateItemRequestDto> {
		const commits = await this.analyticsApi.fetchCommits(
			authToken,
			repositoryUrl,
			since,
		);

		const commitsByAuthor: Record<
			string,
			{
				name: string;
				email: string;
				commitsNumber: number;
				linesAdded: number;
				linesDeleted: number;
			}
		> = {};

		for (const { commit, stats } of commits) {
			const { author } = commit;
			const { name, email } = author;

			if (!commitsByAuthor[email]) {
				commitsByAuthor[email] = {
					name,
					email,
					commitsNumber: 0,
					linesAdded: 0,
					linesDeleted: 0,
				};
			}

			commitsByAuthor[email].commitsNumber += 1;

			if (stats) {
				commitsByAuthor[email].linesAdded += stats.additions || 0;
				commitsByAuthor[email].linesDeleted += stats.deletions || 0;
			}
		}

		const items = Object.values(commitsByAuthor).map(
			({ name, email, commitsNumber, linesAdded, linesDeleted }) => ({
				authorName: name,
				authorEmail: email,
				commitsNumber,
				linesAdded,
				linesDeleted,
			}),
		);

		return {
			date: new Date().toISOString(),
			items,
		};
	}
}

export { AnalyticsService };
