"use client";
import { createStyles } from "antd-style";

export const useProposalsPageStyles = createStyles(({ css, token }) => ({
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

  drawerCard: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    border-radius: 10px !important;
    margin-bottom: 12px;

    .ant-card-body {
      padding: 14px !important;
    }
  `,

  drawerLabel: css`
    color: rgba(255, 255, 255, 0.45) !important;
    font-size: 11px !important;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  `,

  drawerValue: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 600;
  `,

  lineItemTable: css`
    .ant-table {
      background: transparent !important;
    }

    .ant-table-thead > tr > th {
      background: rgba(255, 255, 255, 0.04) !important;
      color: rgba(255, 255, 255, 0.45) !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid rgba(112, 112, 112, 0.25) !important;
      padding: 8px 12px !important;
    }

    .ant-table-tbody > tr > td {
      background: transparent !important;
      border-bottom: 1px solid rgba(112, 112, 112, 0.15) !important;
      color: rgba(255, 255, 255, 0.75) !important;
      padding: 8px 12px !important;
    }

    .ant-table-tbody > tr:hover > td {
      background: rgba(255, 255, 255, 0.03) !important;
    }

    .ant-table-placeholder {
      background: transparent !important;
    }

    .ant-empty-description {
      color: rgba(255, 255, 255, 0.3) !important;
    }
  `,

  totalsRow: css`
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(112, 112, 112, 0.25);
    border-radius: 8px;
    margin-top: 12px;
  `,

  totalsLabel: css`
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 13px;
  `,

  totalsValue: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 600;
    font-size: 13px;
  `,

  totalsFinalLabel: css`
    color: rgba(255, 255, 255, 0.8) !important;
    font-weight: 700;
    font-size: 14px;
  `,

  totalsFinalValue: css`
    color: ${token.colorPrimary} !important;
    font-weight: 700;
    font-size: 16px;
  `,

  rejectInput: css`
    background: rgba(255, 255, 255, 0.05) !important;
    border-color: rgba(112, 112, 112, 0.35) !important;
    color: rgba(255, 255, 255, 0.85) !important;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3) !important;
    }
  `,
}));