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

const stages = [
  { name: "Prospect", count: 12, tone: "prospect", size: "s12" },
  { name: "Qualified", count: 9, tone: "qualified", size: "s9" },
  { name: "Proposal", count: 8, tone: "proposal", size: "s8" },
  { name: "Negotiation", count: 6, tone: "negotiation", size: "s6" },
  { name: "Won", count: 17, tone: "won", size: "s17" },
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