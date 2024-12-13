import { type ActivityLogCreateItemResponseDto } from "~/libs/types/types.js";
import { type ActivityLogService } from "../activity-logs/activity-logs.js";
import { type ActivityLogEntity } from "../activity-logs/activity-log.entity.js";

interface IActivityLogDelegate {
	createActivityLog({
		date,
		logItem,
		projectId,
		userId,
	}: ActivityLogCreateItemResponseDto): Promise<ActivityLogEntity>;
}

class ActivityLogDelegate implements IActivityLogDelegate {
	private activityLogService: ActivityLogService;

	public constructor(activityLogService: ActivityLogService) {
		this.activityLogService = activityLogService;
	}

	public async createActivityLog({
		date,
		logItem,
		projectId,
		userId,
	}: ActivityLogCreateItemResponseDto): Promise<ActivityLogEntity> {
		return await this.activityLogService.createActivityLog({
			date,
			logItem,
			projectId,
			userId,
		});
	}
}

export { ActivityLogDelegate, type IActivityLogDelegate };
