import { IssueCreateItemRequestDto } from "./issue-create-item-request-dto.type.js";

type IssueCreateItemResponseDto = {
	logItem: IssueCreateItemRequestDto;
	projectId: number;
};

export { type IssueCreateItemResponseDto };
