"use client";
import { createStyles } from "antd-style";

export const useNotesPageStyles = createStyles(({ css }) => ({
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

  card: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    border-radius: 12px !important;

    .ant-card-body {
      padding: 0 !important;
    }
  `,

  noteCard: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.25) !important;
    border-radius: 10px !important;
    transition: border-color 0.2s;

    &:hover {
      border-color: rgba(112, 112, 112, 0.5) !important;
    }

    .ant-card-body {
      padding: 16px !important;
    }
  `,

  noteContent: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  `,

  noteMeta: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 12px;
  `,

  privateTag: css`
    background: rgba(255, 77, 79, 0.12) !important;
    border: 1px solid rgba(255, 77, 79, 0.3) !important;
    color: #ff7875 !important;
    font-size: 11px !important;
    border-radius: 4px !important;
    margin-inline-end: 0 !important;
  `,

  relatedTag: css`
    background: rgba(112, 112, 112, 0.2) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 11px !important;
    border-radius: 4px !important;
    margin-inline-end: 0 !important;
  `,

  emptyState: css`
    padding: 60px 24px !important;
    text-align: center;
  `,
}));