"use client";
import { createStyles } from "antd-style";

export const useOpportunitiesPageStyles = createStyles(({ css }) => ({
  page: css`
    width: 100%;
    max-width: 1200px;
  `,
  card: css`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.55);
    border-radius: 12px;

    .ant-card-body {
      padding: 16px;
    }
  `,
  title: css`
    margin: 0 !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 700;
  `,
  primaryBtn: css`
    background-color: #707070 !important;
    border: none !important;
    box-shadow: none !important;

    &:hover,
    &:focus {
      background-color: #70707081 !important;
      border: none !important;
    }
  `,
  tabs: css`
    .ant-tabs-tab {
      color: rgba(255, 255, 255, 0.7);
    }
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: rgba(255, 255, 255, 0.95) !important;
    }
    .ant-tabs-ink-bar {
      background: rgba(255, 255, 255, 0.8);
    }
  `,
}));