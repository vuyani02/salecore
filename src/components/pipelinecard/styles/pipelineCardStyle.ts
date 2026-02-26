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
    height: 8px;
    width: 100%;
  `,
  segment: css`
    height: 8px;
    border-radius: 999px;
    flex: 1 1 0%;
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
  s12: css`
    flex-grow: 12;
  `,
  s9: css`
    flex-grow: 9;
  `,
  s8: css`
    flex-grow: 8;
  `,
  s6: css`
    flex-grow: 6;
  `,
  s17: css`
    flex-grow: 17;
  `,
  badge: css`
    .ant-badge-status-dot {
      width: 10px;
      height: 10px;
    }
  `,
  badge_prospect: css`
    .ant-badge-status-dot {
      background: #7a3db8;
    }
  `,
  badge_qualified: css`
    .ant-badge-status-dot {
      background: #2f66d0;
    }
  `,
  badge_proposal: css`
    .ant-badge-status-dot {
      background: #9bc53d;
    }
  `,
  badge_negotiation: css`
    .ant-badge-status-dot {
      background: #20b2aa;
    }
  `,
  badge_won: css`
    .ant-badge-status-dot {
      background: #2ecc71;
    }
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