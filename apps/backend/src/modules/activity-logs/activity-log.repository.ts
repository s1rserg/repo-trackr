import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import { ActivityLogEntity } from "./activity-log.entity.js";
import { type ActivityLogModel } from "./activity-log.model.js";
import { type ActivityLogQueryParameters } from "./libs/types/types.js";

class ActivityLogRepository implements Repository {
	private activityLogModel: typeof ActivityLogModel;

	public constructor(activityLogModel: typeof ActivityLogModel) {
		this.activityLogModel = activityLogModel;
	}

	public async create(entity: ActivityLogEntity): Promise<ActivityLogEntity> {
		const {
			commitsNumber,
			createdByUser,
			date,
			gitEmail,
			project,
			linesAdded,
			linesDeleted,
		} = entity.toNewObject();

		const activityLogData = {
			commitsNumber,
			createdByUser,
			date,
			gitEmail,
			project,
			linesAdded,
			linesDeleted,
		};

		const createdActivityLog = await this.activityLogModel
			.query()
			.insertGraph(activityLogData, { relate: true })
			.returning("*")
			.execute();

		return ActivityLogEntity.initialize(createdActivityLog);
	}

	public delete(): ReturnType<Repository["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public async findAll({
		contributorName,
		endDate,
		permittedProjectIds,
		projectId,
		startDate,
	}: {
		permittedProjectIds: number[] | undefined;
	} & ActivityLogQueryParameters): Promise<{ items: ActivityLogEntity[] }> {
		const query = this.activityLogModel
			.query()
			.withGraphFetched("[project, createdByUser]")
			.withGraphJoined("gitEmail.contributor")
			.modifyGraph("gitEmail.contributor", (builder) => {
				builder.select("id", "name", "hiddenAt");
			})
			.whereNull("gitEmail:contributor.hiddenAt")
			.whereBetween("activityLogs.date", [
				startDate,
				endDate + "T17:59:59.999Z",
			])
			.orderBy("date");

		if (contributorName) {
			query.whereILike("gitEmail:contributor.name", `%${contributorName}%`);
		}

		const hasPermissionedProjects =
			permittedProjectIds && permittedProjectIds.length !== EMPTY_LENGTH;

		if (projectId) {
			query.where("projectId", projectId);
		} else if (hasPermissionedProjects) {
			query.whereIn("projectId", permittedProjectIds);
		}

		const activityLogs = await query;

		const lastLogPerDay = new Map<string, ActivityLogEntity>();

		for (const log of activityLogs) {
			const [logDate] = new Date(log.date).toISOString().split("T");

			const existingLog = lastLogPerDay.get(logDate || "");

			if (
				!existingLog ||
				new Date(log.date).getTime() >
					new Date(existingLog.toObject().date).getTime()
			) {
				lastLogPerDay.set(logDate || "", ActivityLogEntity.initialize(log));
			}
		}

		const filteredLogs = [...lastLogPerDay.values()];

		return {
			items: filteredLogs,
		};
	}

	public async findAllWithoutFilter(): Promise<{ items: ActivityLogEntity[] }> {
		const activityLogs = await this.activityLogModel
			.query()
			.withGraphFetched("[gitEmail.contributor, project, createdByUser]")
			.modifyGraph("gitEmail.contributor", (builder) => {
				builder.select("id", "name");
			})
			.execute();

		return {
			items: activityLogs.map((activityLog) =>
				ActivityLogEntity.initialize(activityLog),
			),
		};
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { ActivityLogRepository };
