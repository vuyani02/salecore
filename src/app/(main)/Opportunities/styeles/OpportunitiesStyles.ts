"use client";
import { createStyles } from "antd-style";

export const useOpportunitiesPageStyles = createStyles(({ css, token }) => ({
  wrapper: css`
    width: 100%;
  `,

  title: css`
    color: rgba(255, 255, 255, 0.9) !important;
    margin-bottom: 0 !important;
  `,

  primaryBtn: css`
    background: ${token.colorPrimary};
    color: #fff;
    border: none;
    font-weight: 600;

    &:hover {
      opacity: 0.85;
    }
  `,

  card: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    border-radius: 12px !important;
  `,

  tabs: css`
    .ant-tabs-tab {
      color: rgba(255, 255, 255, 0.5);
    }

    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .ant-tabs-ink-bar {
      background: ${token.colorPrimary};
    }

    .ant-tabs-nav::before {
      border-bottom-color: rgba(112, 112, 112, 0.35);
    }
  `,

  tableHeader: css`
    padding: 12px;
    border-bottom: 1px solid rgba(112, 112, 112, 0.35);
  `,

  headerCell: css`
    color: rgba(255, 255, 255, 0.75);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  `,

  tableRow: css`
    padding: 12px;
    border-bottom: 1px solid rgba(112, 112, 112, 0.2);
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
    }
  `,

  cellPrimary: css`
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
  `,

  cellMuted: css`
    color: rgba(255, 255, 255, 0.55);
  `,

  emptyText: css`
    color: rgba(255, 255, 255, 0.4);
    padding: 24px 0;
  `,

  tableFooter: css`
    padding: 12px;
  `,

  showingText: css`
    color: rgba(255, 255, 255, 0.45);
    font-size: 13px;
  `,
}));