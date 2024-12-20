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
		const MAX_PROMPT_SIZE = 2000; // Define an appropriate max size for the prompt
		let currentPrompt = "";
		let currentBatch: TextGetAllItemResponseDto[] = [];
		const results: SentimentAnalysis[] = [];
	
		for (let i = 0; i < items.length; i++) {
			const itemText = `${String(i)}. ${items[i]?.body || ""}`;
			
			// Check if adding this item exceeds the max prompt size
			if (currentPrompt.length + itemText.length > MAX_PROMPT_SIZE) {
				// Fetch response for the current batch
				const response = await this.geminiAnalyticsApi.fetchResponse(currentPrompt);
				results.push(...response);
	
				// Reset the current prompt and batch
				currentPrompt = "";
				currentBatch = [];
			}
	
			// Add the current item to the batch and update the prompt
			currentPrompt += itemText;
			currentBatch.push(items[i]);
		}
	
		// Process any remaining items
		if (currentPrompt) {
			const response = await this.geminiAnalyticsApi.fetchResponse(currentPrompt);
			results.push(...response);
		}
	
		return results;
	}
	
}

export { GeminiAnalyticsService };
