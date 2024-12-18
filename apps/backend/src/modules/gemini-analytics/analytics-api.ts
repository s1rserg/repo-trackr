/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

type Constructor = {
	model: any;
};

class GeminiAnalyticsApi {
	private model;

	public constructor({ model }: Constructor) {
		this.model = model;
	}

	public async fetchResponse(prompt: string): Promise<any> {
		const result = await this.model.generateContent(prompt);
		const response = await result.response;
		const text: string = await response.text();

		return JSON.parse(text);
	}
}

export { GeminiAnalyticsApi };
