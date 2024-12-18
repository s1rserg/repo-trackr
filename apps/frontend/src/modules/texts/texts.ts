import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";
import { TextApi } from "./texts-api.js";

const textApi = new TextApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { textApi };
export { actions, reducer } from "./slices/texts.js";
