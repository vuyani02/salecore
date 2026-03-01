"use client";
import { createStyles } from "antd-style";

export const useClientsPageStyles = createStyles(({ css }) => ({
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

    &:hover, &:focus {
      background-color: #70707081 !important;
      color: #ffffff !important;
      border: none !important;
    }
  `,

  // ── Filters ───────────────────────────────────────────────────────────────
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

    /* Mobile styles */
    @media (max-width: 768px) {
      width: 100% !important;
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

    /* Dropdown menu styles */
    .ant-select-dropdown {
      background-color: #707070 !important;
      border: none !important;
    }

    .ant-select-item {
      color: #ffffff !important;
    }

    .ant-select-item-option-active,
    .ant-select-item-option-selected {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      width: 100% !important;
    }
  `,

  // ── Card & table ──────────────────────────────────────────────────────────
  card: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    border-radius: 12px !important;
    overflow: hidden;

    .ant-card-body {
      padding: 0 !important;
    }

    /* Mobile - make table scrollable horizontally */
    @media (max-width: 768px) {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
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

    /* ── Pagination ───────────────────────────────────────────────────────── */
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

      a, button { color: #ffffff !important; }

      &:hover, &:focus {
        background-color: #70707081 !important;
        border: none !important;
        a, button { color: #ffffff !important; }
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

    .ant-pagination .ant-select-arrow {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    /* Mobile responsive table */
    @media (max-width: 768px) {
      .ant-table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .ant-table {
        min-width: 600px;
      }

      .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td {
        white-space: nowrap;
        min-width: 80px;
      }
    }

    /* Mobile pagination */
    @media (max-width: 768px) {
      .ant-pagination {
        padding: 12px 8px !important;
        flex-wrap: wrap;
        justify-content: center;
      }

      .ant-pagination-total-text {
        width: 100%;
        text-align: center;
        margin-bottom: 8px;
      }
    }
  `,

  // ── Action buttons ────────────────────────────────────────────────────────
  actionBtn: css`
    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(112, 112, 112, 0.3) !important;
    color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: none !important;

    &:hover, &:focus {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      color: #ffffff !important;
    }
  `,

  actionBtnDanger: css`
    background: rgba(255, 77, 79, 0.08) !important;
    border: 1px solid rgba(255, 77, 79, 0.25) !important;
    color: rgba(255, 77, 79, 0.7) !important;
    box-shadow: none !important;

    &:hover, &:focus {
      background: rgba(255, 77, 79, 0.18) !important;
      border-color: rgba(255, 77, 79, 0.5) !important;
      color: #ff4d4f !important;
    }
  `,

  // ── Table cells ───────────────────────────────────────────────────────────
  cellPrimary: css`
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 600;
  `,

  cellMuted: css`
    color: rgba(255, 255, 255, 0.55) !important;
  `,

  // ── View modal ────────────────────────────────────────────────────────────
  avatarCircle: css`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #707070;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    flex-shrink: 0;
  `,

  modalClientName: css`
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 16px !important;
    font-weight: 700 !important;
  `,

  // ── Stat cards inside view modal ──────────────────────────────────────────
  statCard: css`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(112, 112, 112, 0.25);
    border-radius: 10px;
    padding: 14px 16px;
  `,

  statIcon: css`
    font-size: 20px;
    color: rgba(255, 255, 255, 0.35);
  `,

  statValue: css`
    font-size: 18px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.2;
  `,

  statLabel: css`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 2px;
  `,
}));
