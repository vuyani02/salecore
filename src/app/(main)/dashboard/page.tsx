"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, message } from "antd";
import StatCard from "../../../components/statcard/StatCard";
import {
  ArrowUpOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { DashboardOverview } from "../../../types/dashboard";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => `${value.toFixed(2)}%`;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const api = getAxiosInstance();
        const res = await api.get<DashboardOverview>("/api/dashboard/overview");
        setData(res.data);
        console.log(res.data);
      } catch (e: any) {
        message.error(
          e?.response?.data?.title ||
            e?.response?.data?.detail ||
            "Failed to load dashboard"
        );
      }
    };

    load();
  }, []);

  const kpis = useMemo(() => {
    const pipelineValue = data?.opportunities?.pipelineValue ?? 0;
    const winRate = data?.opportunities?.winRate ?? 0;
    const totalContractValue = data?.contracts?.totalContractValue ?? 0;
    const activeContracts = data?.contracts?.totalActiveCount ?? 0;
    const expiring = data?.contracts?.expiringThisMonthCount ?? 0;

    return [
      {
        icon: <ArrowUpOutlined />,
        value: formatCurrency(pipelineValue),
        label: "Pipeline Value",
      },
      {
        icon: <TrophyOutlined />,
        value: formatPercent(winRate),
        label: "Win Rate",
      },
      {
        icon: <DollarOutlined />,
        value: formatCurrency(totalContractValue),
        label: "Total Contract Value",
      },
      {
        icon: <CalendarOutlined />,
        value: String(activeContracts),
        label: "Active Contracts",
        sub: `${expiring} expiring this month`,
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
    </>
  );
}