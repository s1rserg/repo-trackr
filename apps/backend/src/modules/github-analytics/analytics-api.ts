import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";

import { GithubApiPath } from "./libs/enums/enums.js";
import { type CommitResponseDto } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	serverUrl: string;
};

class AnalyticsApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, serverUrl }: Constructor) {
		super({ baseUrl, http, path: "", serverUrl });
	}

	public async fetchCommits(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<CommitResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(
				GithubApiPath.REPOS,
				"/",
				repositoryUrl,
				GithubApiPath.COMMITS,
				{},
			),
			{
				authToken,
				method: "GET",
				query: {
					since,
				},
			},
		);

		return await response.json();
	}
}

export { AnalyticsApi };
