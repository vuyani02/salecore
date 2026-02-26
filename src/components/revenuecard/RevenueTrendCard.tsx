"use client";
import React from "react";
import Link from "next/link";
import { Card, Flex, Typography, Button } from "antd";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { RightOutlined } from "@ant-design/icons";
import { useRevenueTrendCardStyles } from "./styles/revenueTrendCardStyle";

const { Title, Text } = Typography;

export type RevenuePoint = {
  month: string;
  value: number;
};

export type RevenueTrendCardProps = {
  thisMonth: string;
  thisQuarter: string;
  thisYear: string;
  data: RevenuePoint[];
  reportHref?: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  className,
  labelClass,
  valueClass,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  className: string;
  labelClass: string;
  valueClass: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className={className}>
      <div className={labelClass}>{label}</div>
      <div className={valueClass}>{payload[0]?.value}</div>
    </div>
  );
};

const formatYAxis = (v: number) => `R${Math.round(v / 1000)}K`;

const RevenueTrendCard = ({
  thisMonth,
  thisQuarter,
  thisYear,
  data,
  reportHref = "/reports",
}: RevenueTrendCardProps) => {
  const { styles } = useRevenueTrendCardStyles();

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={18}>
        <Flex justify="space-between" align="center" className={styles.headerRow}>
          <Title level={5} className={styles.title}>
            Revenue Trend
          </Title>

          <Button
            type="link"
            className={styles.reportLink}
            icon={<RightOutlined />}
            iconPlacement="end"
          >
            <Link href={reportHref}>VIEW REPORT</Link>
          </Button>
        </Flex>

        <Flex className={styles.kpiGrid} justify="space-between" align="stretch">
          <Flex vertical className={styles.kpiBlock}>
            <Text className={styles.kpiLabel}>This Month</Text>
            <Text className={styles.kpiValue}>{thisMonth}</Text>
          </Flex>

          <div className={styles.divider} />

          <Flex vertical className={styles.kpiBlock}>
            <Text className={styles.kpiLabel}>This Quarter</Text>
            <Text className={styles.kpiValue}>{thisQuarter}</Text>
          </Flex>

          <div className={styles.divider} />

          <Flex vertical className={styles.kpiBlock}>
            <Text className={styles.kpiLabel}>This Year</Text>
            <Text className={styles.kpiValue}>{thisYear}</Text>
          </Flex>
        </Flex>

        <div className={`${styles.chartWrap} ${styles.axis}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(119, 119, 255, 0.40)" />
                  <stop offset="100%" stopColor="rgba(119, 119, 255, 0.00)" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    className={styles.tooltip}
                    labelClass={styles.tooltipLabel}
                    valueClass={styles.tooltipValue}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgba(119, 119, 255, 0.95)"
                strokeWidth={2.2}
                fill="url(#revFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Flex>
    </Card>
  );
};

export default RevenueTrendCard;