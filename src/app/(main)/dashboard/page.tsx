"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, message } from "antd";
import {
  ArrowUpOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { DashboardOverview } from "@/types/dashboard";
import type {
  SalesPerformanceResponse,
  SalesPerformanceTopPerformer,
} from "@/types/salesPerformance";
import StatCard from "../../../components/statcard/StatCard";
import PipelineCard from "../../../components/pipelinecard/PipelineCard";
import ActivityCard from "../../../components/activitycard/ActivityCard";
import RevenueTrendCard from "../../../components/revenuecard/RevenueTrendCard";
import { useDashboardPageStyles } from "./styles/dashboardPageStyle";
import OpportunitiesCard from "@/components/opportunitiescard/Opportunitiescard";
import TopSalesRepsCard from "@/components/topsalesrepscard/topsalesrepscard";

type PipelineTone = "prospect" | "qualified" | "proposal" | "negotiation" | "won";

const stageToneMap: Record<number, PipelineTone> = {
  1: "prospect",
  2: "qualified",
  3: "proposal",
  4: "negotiation",
  5: "won",
};

const formatMoney = (value: number) => {
  if (!Number.isFinite(value)) return "R0";
  if (value >= 1_000_000_000) return `R${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `R${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R${Math.round(value / 1_000)}K`;
  return `R${Math.round(value)}`;
};

const shortMonth = (monthName: string) => {
  const m = monthName.trim().split(" ")[0] ?? monthName;
  return m.slice(0, 3);
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [topReps, setTopReps] = useState<SalesPerformanceTopPerformer[]>([]);
  const { styles } = useDashboardPageStyles();

  useEffect(() => {
    const load = async () => {
      try {
        const api = getAxiosInstance();
        const res = await api.get<DashboardOverview>("/api/dashboard/overview");
        setData(res.data);
      } catch {
        message.error("Failed to load dashboard");
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadTop = async () => {
      try {
        const api = getAxiosInstance();
        const res = await api.get<SalesPerformanceResponse>(
          "/api/dashboard/sales-performance?topCount=5"
        );
        setTopReps(res.data?.topPerformers ?? []);
      } catch {
        setTopReps([]);
      }
    };

    loadTop();
  }, []);

  const pipelineStages = useMemo(() => {
    if (!data?.pipeline?.stages?.length) return [];

    return data.pipeline.stages
      .filter((s) => s.stage >= 1 && s.stage <= 5)
      .map((s) => ({
        name: s.stageName,
        count: s.count,
        tone: stageToneMap[s.stage],
      }));
  }, [data]);

  const kpis = useMemo(() => {
    if (!data) return [];

    return [
      {
        icon: <ArrowUpOutlined />,
        value: formatMoney(data.opportunities.pipelineValue),
        label: "Pipeline Value",
      },
      {
        icon: <TrophyOutlined />,
        value: `${data.opportunities.winRate.toFixed(2)}%`,
        label: "Win Rate",
      },
      {
        icon: <DollarOutlined />,
        value: formatMoney(data.contracts.totalContractValue),
        label: "Total Contract Value",
      },
      {
        icon: <CalendarOutlined />,
        value: String(data.contracts.totalActiveCount),
        label: "Active Contracts",
        sub: `${data.contracts.expiringThisMonthCount} expiring this month`,
        subTone: "danger" as const,
      },
    ];
  }, [data]);

  const revenueChartData = useMemo(() => {
    if (!data?.revenue?.monthlyTrend?.length) return [];

    return data.revenue.monthlyTrend.map((p) => {
      const value = (p.actual ?? 0) > 0 ? p.actual : p.projected ?? 0;
      return {
        month: shortMonth(p.monthName),
        value: Number(value) || 0,
      };
    });
  }, [data]);

  const topSalesItems = useMemo(
    () =>
      topReps.map((r) => ({
        name: r.userName,
        deals: r.wonCount,
        amountLabel: formatMoney(r.totalRevenue),
      })),
    [topReps]
  );

  return (
    <>
      <Row gutter={[16, 16]}>
        {kpis.map(({ label, ...rest }) => (
          <Col key={label} xs={24} sm={12} md={6}>
            <StatCard label={label} {...rest} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className={styles.section}>
        <Col span={24}>
          <PipelineCard stages={pipelineStages} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.section}>
        <Col span={24}>
          <RevenueTrendCard
            thisMonth={formatMoney(data?.revenue?.thisMonth ?? 0)}
            thisQuarter={formatMoney(data?.revenue?.thisQuarter ?? 0)}
            thisYear={formatMoney(data?.revenue?.thisYear ?? 0)}
            data={revenueChartData}
            reportHref="/reports"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={8}>
          <OpportunitiesCard
            totalOpportunities={data?.opportunities?.totalCount ?? 0}
            dealsWon={data?.opportunities?.wonCount ?? 0}
          />
        </Col>

        <Col xs={24} lg={8}>
          <ActivityCard
            upcomingCount={data?.activities?.upcomingCount ?? 0}
            overdueCount={data?.activities?.overdueCount ?? 0}
            completedTodayCount={data?.activities?.completedTodayCount ?? 0}
          />
        </Col>

        <Col xs={24} lg={8}>
          <TopSalesRepsCard reps={topSalesItems} leaderboardHref="/reports" />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;