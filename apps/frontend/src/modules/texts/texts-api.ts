import { APIPath } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type TextGetAllAnalyticsResponseDto,
	type TextQueryParameters,
	TextsApiPath,
} from "~/libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class TextApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ACTIVITY_LOGS, storage });
	}

	public async getAll(
		query: TextQueryParameters,
	): Promise<TextGetAllAnalyticsResponseDto> {
		const { contributorName, endDate, projectId, startDate } = query;

		const queryToSend = {
			...(contributorName ? { contributorName } : {}),
			endDate,
			startDate,
			...(projectId ? { projectId: String(projectId) } : {}),
		};

		const response = await this.load(
			this.getFullEndpoint(TextsApiPath.ROOT, {}),
			{
				hasAuth: true,
				method: "GET",
				query: queryToSend,
			},
		);

		return await response.json<TextGetAllAnalyticsResponseDto>();
	}
}
export { TextApi };
