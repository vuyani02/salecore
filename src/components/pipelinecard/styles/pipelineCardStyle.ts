"use client";
import { createStyles } from "antd-style";

export const usePipelineCardStyles = createStyles(({ css }) => ({
  card: css`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.55);
    border-radius: 8px;
    .ant-card-body {
      padding: 18px;
    }
  `,
  title: css`
    margin: 0 !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 700;
  `,
  bar: css`
    height: 8px;
    width: 100%;
  `,
  segment: css`
    height: 8px;
    border-radius: 999px;
  `,
  legendText: css`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
  `,
  legendCount: css`
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
  `,
}));