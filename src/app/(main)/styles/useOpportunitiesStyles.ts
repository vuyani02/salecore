"use client";
import { createStyles } from "antd-style";

export const useOpportunitiesStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: 24px;
    background-color: #333333; /* Matches your dashboard background */
    min-height: 100vh;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `,
  title: css`
    color: #ffffff !important;
    margin: 0 !important;
  `,
  addButton: css`
    background-color: #6366f1 !important;
    border: none;
    &:hover {
      background-color: #4f46e5 !important;
    }
  `,
  tableCard: css`
    background: #444444;
    border-radius: 8px;
    padding: 16px;
  `,
  fullWidth: css`
    width: 100%;
  `
}));