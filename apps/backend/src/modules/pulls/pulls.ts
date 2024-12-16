import { logger } from "~/libs/modules/logger/logger.js";
import { contributorService } from "~/modules/contributors/contributors.js";
import { gitEmailService } from "~/modules/git-emails/git-emails.js";
import { projectGroupService } from "~/modules/project-groups/project-groups.js";
import { projectService } from "~/modules/projects/projects.js";

import { PullController } from "./pull.controller.js";
import { PullModel } from "./pull.model.js";
import { PullRepository } from "./pull.repository.js";
import { PullService } from "./pull.service.js";
import { analyticsService } from "../github-analytics/analytics.js";

const pullRepository = new PullRepository(PullModel);
const pullService = new PullService({
	pullRepository,
	contributorService,
	gitEmailService,
	projectService,
	analyticsService,
});
const pullController = new PullController(
	logger,
	pullService,
	projectGroupService,
);

export { pullController, pullService };
export { PullService } from "./pull.service.js";
