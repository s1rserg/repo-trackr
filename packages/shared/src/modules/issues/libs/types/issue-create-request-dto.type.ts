import { type ActivityLogCreateItemRequestDto } from "./issue-create-item-request-dto.type.js";

type ActivityLogCreateRequestDto = {
	items: ActivityLogCreateItemRequestDto[];
	userId: number;
};

export { type ActivityLogCreateRequestDto };
