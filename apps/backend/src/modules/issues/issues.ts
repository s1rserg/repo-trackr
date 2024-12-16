import { logger } from "~/libs/modules/logger/logger.js";
import { contributorService } from "~/modules/contributors/contributors.js";
import { gitEmailService } from "~/modules/git-emails/git-emails.js";
import { projectApiKeyService } from "~/modules/project-api-keys/project-api-keys.js";
import { projectGroupService } from "~/modules/project-groups/project-groups.js";
import { projectService } from "~/modules/projects/projects.js";

import { ActivityLogController } from "./issue.controller.js";
import { ActivityLogModel } from "./issue.model.js";
import { ActivityLogRepository } from "./issue.repository.js";
import { ActivityLogService } from "./issue.service.js";
import { analyticsService } from "../github-analytics/analytics.js";

const activityLogRepository = new ActivityLogRepository(ActivityLogModel);
const activityLogService = new ActivityLogService({
	activityLogRepository,
	contributorService,
	gitEmailService,
	projectApiKeyService,
	projectService,
	analyticsService,
});
const activityLogController = new ActivityLogController(
	logger,
	activityLogService,
	projectGroupService,
);

export { activityLogController, activityLogService };
export { ActivityLogService } from "./issue.service.js";