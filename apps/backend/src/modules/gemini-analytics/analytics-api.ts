/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

type Constructor = {
	model: any;
};

class RateLimitedQueue {
	private queue: (() => Promise<any>)[] = [];
	private isProcessing = false;
	private requestsPerSecond: number;
	private interval: number;

	public constructor(requestsPerSecond: number) {
		this.requestsPerSecond = requestsPerSecond;
		this.interval = 1000 / requestsPerSecond;
	}

	public async addRequest(request: () => Promise<any>): Promise<any> {
		return await new Promise((resolve, reject) => {
			this.queue.push(async () => {
				try {
					const result = await request();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
			void this.processQueue();
		});
	}

	private async processQueue() {
		if (this.isProcessing) {
			return;
		}

		this.isProcessing = true;

		while (this.queue.length > 0) {
			const task = this.queue.shift();

			if (task) {
				await task();
			}

			await this.delay(this.interval);
		}

		this.isProcessing = false;
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

class GeminiAnalyticsApi {
	private model;
	private rateLimiter: RateLimitedQueue;

	public constructor({ model }: Constructor) {
		this.model = model;
		this.rateLimiter = new RateLimitedQueue(1); // Adjust requests per second as needed
	}

	public fetchResponse(prompt: string): Promise<any> {
		return this.rateLimiter.addRequest(async () => {
			try {
				const result = await this.model.generateContent(prompt);
				const response = await result.response;
				const text: string = await response.text();

				return JSON.parse(text);
			} catch (error) {
				if (error.message.includes("rate limit")) {
					console.warn("Rate limit reached, retrying...");
					await this.delay(1000); // Adjust retry delay as needed

					return await this.fetchResponse(prompt); // Retry
				}
			}
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export { GeminiAnalyticsApi };
