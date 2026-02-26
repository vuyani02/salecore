export type DashboardOverview = {
  opportunities: {
    totalCount: number;
    wonCount: number;
    winRate: number;
    pipelineValue: number;
  };
  pipeline: {
    stages: {
      stage: number;
      stageName: string;
      count: number;
      totalValue: number;
      weightedValue: number;
    }[];
    weightedPipelineValue: number;
  };
  activities: {
    upcomingCount: number;
    overdueCount: number;
    completedTodayCount: number;
  };
  contracts: {
    totalActiveCount: number;
    expiringThisMonthCount: number;
    totalContractValue: number;
  };
  revenue: {
    thisMonth: number;
    thisQuarter: number;
    thisYear: number;
    monthlyTrend: { period: string; value: number }[];
  };
};