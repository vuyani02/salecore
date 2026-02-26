"use client";
import { createStyles, css } from "antd-style";

export const useStatCardStyles = createStyles({
  card: css`
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(112, 112, 112, 0.55) !important;
    height: 142px;
    border-radius: 8px;
    .ant-card-body {
      padding: 16px;
    }
  `,
  icon: css`
    color: rgba(255, 255, 255, 0.55);
    font-size: 18px;
  `,
  value: css`
    color: rgba(255, 255, 255, 0.95);
    font-size: 18px;
    font-weight: 700;
  `,
  label: css`
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  `,
  sub: css`
    color: rgba(255, 255, 255, 0.55);
    font-size: 11px;
  `,
  danger: css`
    color: #ff4d4f;
  `,
});