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

    monthlyTrend: {
      year: number;
      month: number;
      monthName: string;
      actual: number;
      projected: number;
    }[];
  };
};

export type SalesPerformanceTopPerformer = {
  userId: string;
  userName: string;
  opportunitiesCount: number;
  wonCount: number;
  lostCount: number;
  totalRevenue: number;
};

export type SalesPerformanceResponse = {
  averageDealsPerUser: number;
  averageRevenuePerUser: number;
  topPerformers: SalesPerformanceTopPerformer[];
};