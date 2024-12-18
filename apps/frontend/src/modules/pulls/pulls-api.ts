import { APIPath } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type PullGetAllAnalyticsResponseDto,
	type PullQueryParameters,
	PullsApiPath,
} from "~/libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class PullApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.PULLS, storage });
	}

	public async getAll(
		query: PullQueryParameters,
	): Promise<PullGetAllAnalyticsResponseDto> {
		const { contributorName, endDate, projectId, startDate } = query;

		const queryToSend = {
			...(contributorName ? { contributorName } : {}),
			endDate,
			startDate,
			...(projectId ? { projectId: String(projectId) } : {}),
		};

		const response = await this.load(
			this.getFullEndpoint(PullsApiPath.ROOT, {}),
			{
				hasAuth: true,
				method: "GET",
				query: queryToSend,
			},
		);

		return await response.json<PullGetAllAnalyticsResponseDto>();
	}
}
export { PullApi };
