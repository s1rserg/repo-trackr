import { APIPath } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type IssueGetAllAnalyticsResponseDto,
	type IssueQueryParameters,
	IssuesApiPath,
} from "~/libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class IssueApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ISSUES, storage });
	}

	public async getAll(
		query: IssueQueryParameters,
	): Promise<IssueGetAllAnalyticsResponseDto> {
		const { contributorName, endDate, projectId, startDate } = query;

		const queryToSend = {
			...(contributorName ? { contributorName } : {}),
			endDate,
			startDate,
			...(projectId ? { projectId: String(projectId) } : {}),
		};

		const response = await this.load(
			this.getFullEndpoint(IssuesApiPath.ROOT, {}),
			{
				hasAuth: true,
				method: "GET",
				query: queryToSend,
			},
		);

		return await response.json<IssueGetAllAnalyticsResponseDto>();
	}
}
export { IssueApi };
