import { config } from "~/libs/modules/config/config.js";
import { GeminiAnalyticsApi } from "./analytics-api.js";
import { GeminiAnalyticsService } from "./analytics.service.js";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(config.ENV.API.GEMINI);
const schema = {
	description: "List of items with sentiment analysis",
	type: SchemaType.ARRAY,
	items: {
		type: SchemaType.OBJECT,
		properties: {
			sentimentScore: {
				type: SchemaType.NUMBER,
				description:
					"Sentiment score ranging (spectre) from -1 (negative) to 1 (positive), try not to get all contents value 0, please be more decisive, you can use 0.1, -0.1 for this",
				nullable: false,
				minimum: -1,
				maximum: 1,
			},
			sentimentLabel: {
				type: SchemaType.STRING,
				description:
					"Sentiment label, e.g., 'positive', 'neutral', or 'negative' also 'technical' or smth else, try be more creative here, maybe a simple description or reason",
				nullable: false,
			},
		},
		required: ["sentimentScore", "sentimentLabel"],
	},
};
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	generationConfig: {
		responseMimeType: "application/json",
		responseSchema: schema,
	},
});

const geminiAnalyticsApi = new GeminiAnalyticsApi({
	model,
});

const geminiAnalyticsService = new GeminiAnalyticsService({
	geminiAnalyticsApi,
});

export { geminiAnalyticsApi, geminiAnalyticsService };
export { GeminiAnalyticsService } from "./analytics.service.js";
