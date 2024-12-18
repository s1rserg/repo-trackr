import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";
import { PullApi } from "./pulls-api.js";

const pullApi = new PullApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { pullApi };
export { actions, reducer } from "./slices/pulls.js";
