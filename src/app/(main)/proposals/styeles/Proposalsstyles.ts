"use client";
import { createStyles } from "antd-style";

export const useProposalsPageStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
  `,

  title: css`
    color: rgba(255, 255, 255, 0.9) !important;
    margin-bottom: 0 !important;
  `,

  primaryBtn: css`
    background-color: #707070 !important;
    border: none !important;
    box-shadow: none !important;
    color: #ffffff !important;
    font-weight: 600;

    &:hover,
    &:focus {
      background-color: #70707081 !important;
      color: #ffffff !important;
      border: none !important;
    }
  `,

  searchInput: css`
    background-color: #707070 !important;
    border: none !important;
    color: #ffffff !important;

    input {
      background-color: transparent !important;
      color: #ffffff !important;

      &::placeholder {
        color: rgba(255, 255, 255, 0.35) !important;
      }
    }

    .ant-input-clear-icon {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    &:hover, &:focus-within {
      box-shadow: none !important;
      background-color: #707070 !important;
    }
  `,

  filterSelect: css`
    background-color: #707070 !important;
    border: none !important;
    border-radius: 6px !important;

    .ant-select-selector {
      background-color: #707070 !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      border-radius: 6px !important;
      color: #ffffff !important;
    }

    &:hover .ant-select-selector,
    &.ant-select-focused .ant-select-selector,
    &.ant-select-open .ant-select-selector,
    .ant-select-selector:focus,
    .ant-select-selector:focus-within,
    .ant-select-selector:focus-visible {
      background-color: #707070 !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      border-color: transparent !important;
    }

    &.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
      border: none !important;
      box-shadow: none !important;
    }

    .ant-select-selection-placeholder {
      color: rgba(255, 255, 255, 0.55) !important;
    }

    .ant-select-selection-item {
      color: #ffffff !important;
    }

    .ant-select-arrow, .ant-select-clear {
      color: rgba(255, 255, 255, 0.55) !important;
      background: transparent !important;
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

    /* ── Pagination ─────────────────────────────────────────────────────────── */
    .ant-pagination {
      padding: 16px !important;
      margin: 0 !important;
    }

    .ant-pagination-total-text {
      color: rgba(255, 255, 255, 0.45) !important;
    }

    .ant-pagination-item,
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
      background-color: #707070 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 6px !important;

      a, button {
        color: #ffffff !important;
      }

      &:hover,
      &:focus {
        background-color: #70707081 !important;
        border: none !important;

        a, button {
          color: #ffffff !important;
        }
      }
    }

    .ant-pagination-item-active {
      background-color: #707070 !important;
      opacity: 0.7;
    }

    .ant-pagination-disabled .ant-pagination-item-link {
      opacity: 0.3 !important;
      cursor: not-allowed;
    }

    .ant-pagination-jump-prev .ant-pagination-item-ellipsis,
    .ant-pagination-jump-next .ant-pagination-item-ellipsis {
      color: rgba(255, 255, 255, 0.35) !important;
    }

    .ant-pagination .ant-select .ant-select-selector {
      background-color: #707070 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 6px !important;
      color: #ffffff !important;
    }

    .ant-pagination .ant-select:hover .ant-select-selector,
    .ant-pagination .ant-select:focus .ant-select-selector {
      background-color: #70707081 !important;
      border: none !important;
    }

    .ant-pagination .ant-select-arrow {
      color: rgba(255, 255, 255, 0.7) !important;
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
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid rgba(112, 112, 112, 0.25) !important;
    border-radius: 8px !important;

    .ant-card-body {
      padding: 12px !important;
    }
  `,

  drawerLabel: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 11px !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,

  drawerValue: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 600;
    font-size: 13px;
  `,

  lineItemTable: css`
    .ant-table {
      background: transparent !important;
    }

    .ant-table-thead > tr > th {
      background: rgba(0, 0, 0, 0.02) !important;
      color: rgba(0, 0, 0, 0.45) !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    }

    .ant-table-tbody > tr > td {
      background: transparent !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    }

    .ant-table-tbody > tr:hover > td {
      background: rgba(0, 0, 0, 0.02) !important;
    }

    .ant-table-placeholder {
      background: transparent !important;
    }

    .ant-empty-description {
      color: rgba(0, 0, 0, 0.35) !important;
    }
  `,

  totalsRow: css`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(112, 112, 112, 0.25);
    border-radius: 8px;
    padding: 12px 16px;
  `,

  totalsLabel: css`
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 13px;
  `,

  totalsValue: css`
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 13px;
  `,

  totalsFinalLabel: css`
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 700;
    font-size: 14px;
  `,

  totalsFinalValue: css`
    color: rgba(255, 255, 255, 0.95) !important;
    font-weight: 700;
    font-size: 15px;
  `,
}));