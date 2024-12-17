import { logger } from "~/libs/modules/logger/logger.js";
import { contributorService } from "~/modules/contributors/contributors.js";
import { gitEmailService } from "~/modules/git-emails/git-emails.js";
import { projectGroupService } from "~/modules/project-groups/project-groups.js";
import { projectService } from "~/modules/projects/projects.js";

import { IssueController } from "./text.controller.js";
import { IssueModel } from "./text.model.js";
import { IssueRepository } from "./text.repository.js";
import { IssueService } from "./text.service.js";
import { analyticsService } from "../github-analytics/analytics.js";

const issueRepository = new IssueRepository(IssueModel);
const issueService = new IssueService({
	issueRepository,
	contributorService,
	gitEmailService,
	projectService,
	analyticsService,
});
const issueController = new IssueController(
	logger,
	issueService,
	projectGroupService,
);

export { issueController, issueService };
export { IssueService } from "./text.service.js";