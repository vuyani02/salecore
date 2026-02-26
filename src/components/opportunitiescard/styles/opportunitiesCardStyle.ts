"use client";
import { createStyles } from "antd-style";

export const useOpportunitiesCardStyles = createStyles(({ css }) => ({
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
    font-weight: 700 !important;
  `,
  item: css`
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(112, 112, 112, 0.35);
    border-radius: 8px;
    padding: 14px 14px;
  `,
  iconWrap: css`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  icon: css`
    color: rgba(255, 255, 255, 0.75);
    font-size: 16px;
  `,
  value: css`
    font-size: 22px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.92);
    line-height: 1;
  `,
  label: css`
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
  `,
}));