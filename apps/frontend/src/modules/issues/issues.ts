import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { IssueApi } from "./issues-api.js";

const issueApi = new IssueApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { issueApi };
export { actions, reducer } from "./slices/issues.js";
