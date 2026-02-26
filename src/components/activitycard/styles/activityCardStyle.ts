"use client";
import { createStyles } from "antd-style";

export const useActivityCardStyles = createStyles(({ css }) => ({
  card: css`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.55);
    border-radius: 8px;

    .ant-card-body {
      padding: 18px;
    }
  `,
  titleRow: css`
    width: 100%;
  `,
  title: css`
    margin: 0 !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 700;
  `,
  pill: css`
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(112, 112, 112, 0.55);
    color: rgba(255, 255, 255, 0.75);
    font-size: 12px;
    font-weight: 600;
  `,
  list: css`
    width: 100%;
  `,
  row: css`
    width: 100%;
    padding: 12px 12px;
    border-radius: 10px;
    border: 1px solid rgba(112, 112, 112, 0.4);
    background: rgba(255, 255, 255, 0.04);
  `,
  left: css`
    min-width: 0;
  `,
  label: css`
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
    font-weight: 600;
  `,
  meta: css`
    color: rgba(255, 255, 255, 0.55);
    font-size: 12px;
    margin-top: 2px;
  `,
  count: css`
    color: rgba(255, 255, 255, 0.92);
    font-weight: 800;
    font-size: 20px;
    line-height: 1;
  `,
  dot: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: 0 0 10px;
  `,
  dotUpcoming: css`
    background: #2f66d0;
  `,
  dotOverdue: css`
    background: #ff4d4f;
  `,
  dotCompleted: css`
    background: #2ecc71;
  `,
}));