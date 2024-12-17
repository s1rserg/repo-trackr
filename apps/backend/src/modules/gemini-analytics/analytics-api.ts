/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */


type Constructor = {
	model: any;
};

class GeminiAnalyticsApi {
	private model;

	public constructor({ model }: Constructor) {
		this.model = model
	}

	public async fetchCommits(
		authToken: string,
		repositoryUrl: string,
		since: string,
	): Promise<CommitResponseDto> {
		return commits;
	}
}

export { GeminiAnalyticsApi };
