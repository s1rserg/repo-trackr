import { http } from "~/libs/modules/http/http.js";

import { AnalyticsApi } from "./analytics-api.js";

const analyticsApi = new AnalyticsApi({
	baseUrl: "",
	http,
	serverUrl: "https://api.github.com",
});

export { analyticsApi };
export { AnalyticsService } from "./analytics.service.js";
