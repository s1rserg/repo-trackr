import { z } from "zod";

import {
	ProjectValidationMessage,
	ProjectValidationRule,
} from "../enums/enums.js";
import { type ProjectConfigureAnalyticsRequestDto } from "../types/types.js";

const projectConfigureAnalytics: z.ZodType<ProjectConfigureAnalyticsRequestDto> =
	z
		.object({
			apiKey: z
				.string()
				.trim()
				.min(ProjectValidationRule.INPUT_MINIMUM_LENGTH, {
					message: ProjectValidationMessage.INPUT_REQUIRED,
				})
				.max(ProjectValidationRule.INPUT_MAXIMUM_LENGTH, {
					message: ProjectValidationMessage.INPUT_TOO_LONG,
				}),
			repositoryUrl: z
				.string()
				.trim()
				.min(ProjectValidationRule.INPUT_MINIMUM_LENGTH, {
					message: ProjectValidationMessage.INPUT_REQUIRED,
				})
				.max(ProjectValidationRule.INPUT_MAXIMUM_LENGTH, {
					message: ProjectValidationMessage.INPUT_TOO_LONG,
				}),
		})
		.required();

export { projectConfigureAnalytics };
