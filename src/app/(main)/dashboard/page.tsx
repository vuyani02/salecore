"use client";
import React from "react";
import { Row, Col } from "antd";
import PipelineCard, {
  PipelineStage,
} from "../../../components/pipelinecard/PipelineCard";
import StatCard from "../../../components/statcard/StatCard";
import {
  ArrowUpOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const stages: PipelineStage[] = [
  { name: "Prospect", count: 12, color: "#7A3DB8", flex: 12 },
  { name: "Qualified", count: 9, color: "#2F66D0", flex: 9 },
  { name: "Proposal", count: 8, color: "#9BC53D", flex: 8 },
  { name: "Negotiation", count: 6, color: "#20B2AA", flex: 6 },
  { name: "Won", count: 17, color: "#2ECC71", flex: 17 },
];

const kpis = [
  { icon: <ArrowUpOutlined />, value: "R2.5M", label: "Pipeline Value" },
  { icon: <TrophyOutlined />, value: "35.4%", label: "Win Rate" },
  { icon: <DollarOutlined />, value: "R8.2M", label: "Total Contract Value" },
  {
    icon: <CalendarOutlined />,
    value: "31",
    label: "Active Contracts",
    sub: "4 expiring this month",
    subTone: "danger" as const,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Row gutter={[16, 16]}>
        {kpis.map(({ label, ...rest }) => (
          <Col key={label} xs={24} sm={12} md={6}>
            <StatCard label={label} {...rest} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <PipelineCard stages={stages} />
        </Col>
      </Row>
    </>
  );
}