type CommitAuthorDto = {
	name: string;
	email: string;
	date: string;
};

type CommitStatsDto = {
	additions: number;
	deletions: number;
	total: number;
};

export { type CommitStatistics } from "./commit-statistics.type.js";
export {
	type ActivityLogCreateItemRequestDto,
	type ActivityLogCreateRequestDto,
	type ActivityLogGetAllItemResponseDto,
	type ActivityLogGetAllResponseDto,
	type ContributorGetAllItemResponseDto,
} from "@repo-trackr/shared";
export type CommitDto = {
	author: CommitAuthorDto;
	message: string;
	stats: CommitStatsDto | undefined;
};
export type CommitResponseDto = {
	commit: CommitDto;
	sha: string;
	stats: CommitStatsDto | undefined;
}[];
