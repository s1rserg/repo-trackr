import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { ActivityLogApi } from "./issues-api.js";

const activityLogApi = new ActivityLogApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { activityLogApi };
export {
	type ActivityLogGetAllAnalyticsResponseDto,
	type ActivityLogGetAllItemAnalyticsResponseDto,
	type ActivityLogGetAllItemResponseDto,
	type ActivityLogGetAllResponseDto,
	type ActivityLogQueryParameters,
} from "./libs/types/types.js";
export { actions, reducer } from "./slices/issues.js";
