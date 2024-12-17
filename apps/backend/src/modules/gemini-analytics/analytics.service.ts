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
		
	): Promise<any> {
		const prompt = "analyse this"

		return await this.geminiAnalyticsApi.fetchResponse(prompt);
	}
}

export { GeminiAnalyticsService };
