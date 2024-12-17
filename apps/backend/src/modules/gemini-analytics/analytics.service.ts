import { type GeminiAnalyticsApi } from "./analytics-api.js";

type Constructor = {
	geminiAnalyticsApi: typeof GeminiAnalyticsApi;
};

class GeminiAnalyticsService {
	private geminiAnalyticsApi: typeof GeminiAnalyticsApi;

	public constructor({ geminiAnalyticsApi }: Constructor) {
		this.geminiAnalyticsApi = geminiAnalyticsApi;
	}

	public async getIssues(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<void> {
		return await this.analyticsApi.fetch(authToken, repositoryUrl, since);
	}
}

export { GeminiAnalyticsService };
