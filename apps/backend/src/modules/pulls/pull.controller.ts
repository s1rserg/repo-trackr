import {
	APIPath,
	PermissionKey,
	ProjectPermissionKey,
} from "~/libs/enums/enums.js";
import { checkHasPermission } from "~/libs/helpers/helpers.js";
import { checkUserPermissions } from "~/libs/hooks/hooks.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ProjectGroupService } from "~/modules/project-groups/project-groups.js";
import { type UserAuthResponseDto } from "~/modules/users/users.js";

import { type PermissionGetAllItemResponseDto } from "../permissions/libs/types/types.js";
import { type PullService } from "./pull.service.js";
import {} from "./libs/types/types.js";
import {
	PullsApiPath,
	type PullQueryParameters,
} from "~/libs/types/types.js";

class PullController extends BaseController {
	private pullService: PullService;
	private projectGroupService: ProjectGroupService;

	public constructor(
		logger: Logger,
		pullService: PullService,
		projectGroupService: ProjectGroupService,
	) {
		super(logger, APIPath.PULLS);

		this.pullService = pullService;
		this.projectGroupService = projectGroupService;

		this.addRoute({
			handler: (options) =>
				this.findAll(
					options as APIHandlerOptions<{
						query: PullQueryParameters;
						user: UserAuthResponseDto;
					}>,
				),
			method: "GET",
			path: PullsApiPath.ROOT,
			preHandlers: [
				checkUserPermissions(
					[PermissionKey.VIEW_ALL_PROJECTS, PermissionKey.MANAGE_ALL_PROJECTS],
					[
						ProjectPermissionKey.VIEW_PROJECT,
						ProjectPermissionKey.EDIT_PROJECT,
						ProjectPermissionKey.MANAGE_PROJECT,
					],
				),
			],
		});
	}

	private async findAll(
		options: APIHandlerOptions<{
			query: PullQueryParameters;
			user: UserAuthResponseDto;
		}>,
	): Promise<APIHandlerResponse> {
		const { contributorName, endDate, projectId, startDate } = options.query;
		const { user } = options;

		const groups = await this.projectGroupService.findAllByUserId(user.id);
		const rootPermissions: PermissionGetAllItemResponseDto[] =
			user.groups.flatMap((group) =>
				group.permissions.map((permission) => ({
					id: permission.id,
					key: permission.key,
					name: permission.name,
				})),
			);

		const hasRootPermission = checkHasPermission(
			[PermissionKey.MANAGE_ALL_PROJECTS, PermissionKey.VIEW_ALL_PROJECTS],
			rootPermissions,
		);
		const userProjectIds = groups.map(({ projectId }) => projectId.id);

		return {
			payload: await this.pullService.findAll({
				endDate,
				hasRootPermission,
				startDate,
				userProjectIds,
				...(contributorName ? { contributorName } : {}),
				...(projectId ? { projectId: Number(projectId) } : {}),
			}),
			status: HTTPCode.OK,
		};
	}
}

export { PullController };
