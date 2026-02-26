"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, message } from "antd";
import PipelineCard from "../../../components/pipelinecard/PipelineCard";
import StatCard from "../../../components/statcard/StatCard";
import {
  ArrowUpOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { DashboardOverview } from "../../../types/dashboard";
import ActivityCard from "../../../components/activitycard/ActivityCard";

const stageToneMap: Record<number, any> = {
  1: "prospect",
  2: "qualified",
  3: "proposal",
  4: "negotiation",
  5: "won",
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const api = getAxiosInstance();
        const res = await api.get<DashboardOverview>(
          "/api/dashboard/overview"
        );
        setData(res.data);
        console.log(res.data)
      } catch (e: any) {
        message.error("Failed to load dashboard");
      }
    };

    load();
  }, []);

  const pipelineStages = useMemo(() => {
  if (!data?.pipeline?.stages) return [];

  const stageToneMap: Record<number, any> = {
    1: "prospect",
    2: "qualified",
    3: "proposal",
    4: "negotiation",
    5: "won",
  };

  return data.pipeline.stages
        .filter((s) => s.stage >= 1 && s.stage <= 5)
        .map((s) => ({
        name: s.stageName,
        count: s.count,
        tone: stageToneMap[s.stage],
        weight: Math.max(1, s.count),
        }));
    }, [data]);

  const kpis = useMemo(() => {
    if (!data) return [];

    return [
      {
        icon: <ArrowUpOutlined />,
        value: data.opportunities.pipelineValue.toLocaleString(),
        label: "Pipeline Value",
      },
      {
        icon: <TrophyOutlined />,
        value: `${data.opportunities.winRate.toFixed(2)}%`,
        label: "Win Rate",
      },
      {
        icon: <DollarOutlined />,
        value: data.contracts.totalContractValue.toLocaleString(),
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

  return (
    <>
      <Row gutter={[16, 16]}>
        {kpis.map(({ label, ...rest }) => (
          <Col key={label} xs={24} sm={12} md={6}>
            <StatCard label={label} {...rest} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
            <PipelineCard stages={pipelineStages} />
        </Col>
     </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
            <PipelineCard stages={pipelineStages} />
        </Col>

        <Col xs={24} lg={8}>
            <ActivityCard
            upcomingCount={data?.activities?.upcomingCount ?? 0}
            overdueCount={data?.activities?.overdueCount ?? 0}
            completedTodayCount={data?.activities?.completedTodayCount ?? 0}
            />
        </Col>
     </Row>
    </>
  );
}

export default  DashboardPage