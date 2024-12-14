import { http } from "~/libs/modules/http/http.js";

import { AnalyticsApi } from "./analytics-api.js";
import { AnalyticsService } from "./analytics.service.js";

const analyticsApi = new AnalyticsApi({
	baseUrl: "",
	http,
	serverUrl: "https://api.github.com",
});

const analyticsService = new AnalyticsService({ analyticsApi });

export { analyticsApi, analyticsService };
export { AnalyticsService } from "./analytics.service.js";
