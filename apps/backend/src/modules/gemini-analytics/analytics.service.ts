import { type GeminiAnalyticsApi } from "./analytics-api.js";

type Constructor = {
	geminiAnalyticsApi: GeminiAnalyticsApi;
};

class GeminiAnalyticsService {
	private geminiAnalyticsApi: GeminiAnalyticsApi;

	public constructor({ geminiAnalyticsApi }: Constructor) {
		this.geminiAnalyticsApi = geminiAnalyticsApi;
	}

	public async getSantimentAnalysis(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<void> {
		return await this.geminiAnalyticsApi.fetch(authToken, repositoryUrl, since);
	}
}

export { GeminiAnalyticsService };
