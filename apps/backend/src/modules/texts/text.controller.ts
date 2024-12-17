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
import { type TextService } from "./text.service.js";
import {} from "./libs/types/types.js";
import {
	TextsApiPath,
	type TextQueryParameters,
} from "~/libs/types/types.js";

class TextController extends BaseController {
	private textService: TextService;
	private projectGroupService: ProjectGroupService;

	public constructor(
		logger: Logger,
		textService: TextService,
		projectGroupService: ProjectGroupService,
	) {
		super(logger, APIPath.ISSUES);

		this.textService = textService;
		this.projectGroupService = projectGroupService;

		this.addRoute({
			handler: (options) =>
				this.findAll(
					options as APIHandlerOptions<{
						query: TextQueryParameters;
						user: UserAuthResponseDto;
					}>,
				),
			method: "GET",
			path: TextsApiPath.ROOT,
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
			query: TextQueryParameters;
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
			payload: await this.textService.findAll({
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

export { TextController };
