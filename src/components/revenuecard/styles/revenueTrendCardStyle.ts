"use client";
import { createStyles } from "antd-style";

export const useRevenueTrendCardStyles = createStyles(({ css }) => ({
  card: css`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(112, 112, 112, 0.35);
    border-radius: 18px;

    .ant-card-body {
      padding: 22px;
    }
  `,
  headerRow: css`
    width: 100%;
  `,
  title: css`
    margin: 0 !important;
    letter-spacing: 0.12em;
    font-size: 12px !important;
    font-weight: 700 !important;
    color: rgba(255, 255, 255, 0.45) !important;
    text-transform: uppercase;
  `,
  reportLink: css`
    color: rgba(119, 119, 255, 0.95) !important;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0 !important;
    height: auto !important;

    &:hover {
      color: rgba(119, 119, 255, 0.8) !important;
    }
  `,
  kpiGrid: css`
    width: 100%;
  `,
  kpiBlock: css`
    padding: 8px 0;
  `,
  kpiLabel: css`
    display: block;
    letter-spacing: 0.12em;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-bottom: 6px;
  `,
  kpiValue: css`
    font-size: 26px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.92);
  `,
  divider: css`
    width: 1px;
    background: rgba(255, 255, 255, 0.12);
    align-self: stretch;
    margin: 0 18px;
  `,
  chartWrap: css`
    width: 100%;
    height: 260px;
  `,
  axis: css`
    .recharts-cartesian-axis-tick-value {
      fill: rgba(255, 255, 255, 0.45);
      font-size: 12px;
    }
    .recharts-cartesian-grid line {
      stroke: rgba(255, 255, 255, 0.08);
      stroke-dasharray: 3 3;
    }
  `,
  tooltip: css`
    background: rgba(20, 20, 28, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 10px 12px;
    color: rgba(255, 255, 255, 0.85);
  `,
  tooltipLabel: css`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 6px;
  `,
  tooltipValue: css`
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  `,
}));