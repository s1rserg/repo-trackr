import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		PORT: number;
	};
	DB: {
		CONNECTION_STRING: string;
		DIALECT: string;
		POOL_MAX: number;
		POOL_MIN: number;
	};
	ENCRYPTION: {
		ALGORITHM: string;
		SALT_ROUNDS: number;
		SECRET: string;
	};
	JWT: {
		ALGORITHM: string;
		EXPIRATION_TIME: string;
		SECRET: string;
	};
	API: {
		GEMINI: string;
	};
};

export { type EnvironmentSchema };
