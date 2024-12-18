type AnalyticsRow = {
	contributorId: string;
	contributorName: string;
	metrics: Record<string, (number | string)[]>;
  };
  
export { type AnalyticsRow };
