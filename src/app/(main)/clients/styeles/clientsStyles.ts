"use client";
import { createStyles } from "antd-style";

export const useClientsPageStyles = createStyles(({ css, token }) => ({
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

    .ant-card-body {
      padding: 0 !important;
    }
  `,

  table: css`
    .ant-table {
      background: transparent !important;
    }

    .ant-table-thead > tr > th {
      background: rgba(255, 255, 255, 0.04) !important;
      color: rgba(255, 255, 255, 0.55) !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid rgba(112, 112, 112, 0.35) !important;
    }

    .ant-table-tbody > tr > td {
      background: transparent !important;
      border-bottom: 1px solid rgba(112, 112, 112, 0.2) !important;
      color: rgba(255, 255, 255, 0.85) !important;
    }

    .ant-table-tbody > tr:hover > td {
      background: rgba(255, 255, 255, 0.04) !important;
    }

    .ant-table-placeholder {
      background: transparent !important;
    }

    .ant-empty-description {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    .ant-pagination {
      padding: 16px !important;
      margin: 0 !important;
    }

    .ant-pagination-item a {
      color: rgba(255, 255, 255, 0.6) !important;
    }

    .ant-pagination-item-active {
      background: ${token.colorPrimary} !important;
      border-color: ${token.colorPrimary} !important;
    }

    .ant-pagination-item-active a {
      color: #fff !important;
    }

    .ant-pagination-prev button,
    .ant-pagination-next button {
      color: rgba(255, 255, 255, 0.6) !important;
    }

    .ant-select-selector {
      background: transparent !important;
      color: rgba(255, 255, 255, 0.6) !important;
      border-color: rgba(112, 112, 112, 0.35) !important;
    }

    .ant-pagination-total-text {
      color: rgba(255, 255, 255, 0.45) !important;
    }
  `,

  cellPrimary: css`
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 600;
  `,

  cellMuted: css`
    color: rgba(255, 255, 255, 0.55) !important;
  `,
}));