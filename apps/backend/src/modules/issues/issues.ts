import { logger } from "~/libs/modules/logger/logger.js";
import { contributorService } from "~/modules/contributors/contributors.js";
import { gitEmailService } from "~/modules/git-emails/git-emails.js";
import { projectGroupService } from "~/modules/project-groups/project-groups.js";
import { projectService } from "~/modules/projects/projects.js";

import { IssueController } from "./issue.controller.js";
import { IssueModel } from "./issue.model.js";
import { IssueRepository } from "./issue.repository.js";
import { IssueService } from "./issue.service.js";
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
export { IssueService } from "./issue.service.js";
