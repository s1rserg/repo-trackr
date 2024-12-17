import { GeminiAnalyticsApi } from "./analytics-api.js";
import { GeminiAnalyticsService } from "./analytics.service.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const geminiAnalyticsApi = new GeminiAnalyticsApi({
	model
});

const analyticsService = new GeminiAnalyticsService({geminiAnalyticsApi});

export { geminiAnalyticsApi, analyticsService };
export { GeminiAnalyticsService } from "./analytics.service.js";
