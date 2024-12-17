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
			content: {
				type: SchemaType.STRING,
				description: "The content or text being analyzed",
				nullable: false,
			},
			sentimentScore: {
				type: SchemaType.NUMBER,
				description:
					"Sentiment score ranging from -1 (negative) to 1 (positive)",
				nullable: false,
				minimum: -1,
				maximum: 1,
			},
			sentimentLabel: {
				type: SchemaType.STRING,
				description:
					"Sentiment label, e.g., 'positive', 'neutral', or 'negative' maybe a simple description or reason",
				nullable: false,
			},
		},
		required: ["content", "sentimentScore", "sentimentLabel"],
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

const analyticsService = new GeminiAnalyticsService({ geminiAnalyticsApi });

export { geminiAnalyticsApi, analyticsService };
export { GeminiAnalyticsService } from "./analytics.service.js";
