"use client";
import { createStyles } from "antd-style";

export const usePipelineCardStyles = createStyles(({ css }) => ({
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
    font-weight: 700;
  `,
  bar: css`
    width: 100%;
    height: 10px;
    display: flex;
    overflow: hidden;
    border-radius: 6px;
  `,
  segment: css`
    height: 100%;
  `,
  dot: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  `,
  prospect: css`
    background: #7a3db8;
  `,
  qualified: css`
    background: #2f66d0;
  `,
  proposal: css`
    background: #9bc53d;
  `,
  negotiation: css`
    background: #20b2aa;
  `,
  won: css`
    background: #2ecc71;
  `,
  legendText: css`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
  `,
  legendCount: css`
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
  `,
}));