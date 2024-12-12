import { ProjectValidationRule } from "./project-validation-rule.enum.js";

const ProjectValidationMessage = {
	DESCRIPTION_TOO_LONG: `Description is too long (> ${String(ProjectValidationRule.DESCRIPTION_MAXIMUM_LENGTH)} symbols).`,
	NAME_REQUIRED: "Project name is required.",
	NAME_TOO_LONG: `Name is too long (> ${String(ProjectValidationRule.NAME_MAXIMUM_LENGTH)} symbols).`,
	INPUT_TOO_LONG: `Your input is too long (> ${String(ProjectValidationRule.INPUT_MAXIMUM_LENGTH)} symbols).`,
	INPUT_REQUIRED: "Input is required.",
} as const;

export { ProjectValidationMessage };
