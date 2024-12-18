import { logger } from "~/libs/modules/logger/logger.js";
import { contributorService } from "~/modules/contributors/contributors.js";
import { gitEmailService } from "~/modules/git-emails/git-emails.js";
import { projectGroupService } from "~/modules/project-groups/project-groups.js";
import { projectService } from "~/modules/projects/projects.js";

import { TextController } from "./text.controller.js";
import { TextModel } from "./text.model.js";
import { TextRepository } from "./text.repository.js";
import { TextService } from "./text.service.js";
import { analyticsService } from "../github-analytics/analytics.js";
import { geminiAnalyticsService } from "../gemini-analytics/analytics.js";

const textRepository = new TextRepository(TextModel);
const textService = new TextService({
	textRepository,
	contributorService,
	gitEmailService,
	projectService,
	analyticsService,
	geminiAnalyticsService,
});
const textController = new TextController(
	logger,
	textService,
	projectGroupService,
);

export { textController, textService };
export { TextService } from "./text.service.js";
