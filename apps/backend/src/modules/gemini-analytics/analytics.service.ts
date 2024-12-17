import { type TextGetAllItemResponseDto } from "~/libs/types/types.js";
import { type GeminiAnalyticsApi } from "./analytics-api.js";

type Constructor = {
	geminiAnalyticsApi: GeminiAnalyticsApi;
};

type SentimentAnalysis = {
	sentimentScore: number;
	sentimentLabel: string;
};

class GeminiAnalyticsService {
	private geminiAnalyticsApi: GeminiAnalyticsApi;

	public constructor({ geminiAnalyticsApi }: Constructor) {
		this.geminiAnalyticsApi = geminiAnalyticsApi;
	}

	public async getSentimentAnalysis(
		items: TextGetAllItemResponseDto[],
	): Promise<SentimentAnalysis[]> {
		let prompt = "";

		for (let i = 0; i < items.length; i++) {
			prompt += String(i) + ". " + (items[i]?.body || "");
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return await this.geminiAnalyticsApi.fetchResponse(prompt);
	}
}

export { GeminiAnalyticsService };
