"use client";
import { createStyles } from "antd-style";

export const useTopSalesRepsCardStyles = createStyles(({ css }) => ({
  card: css`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.55);
    border-radius: 12px;
    backdrop-filter: blur(100px);

    .ant-card-body {
      padding: 18px;
    }
  `,
  header: css`
    margin-bottom: 14px;
  `,
  headerTitle: css`
    letter-spacing: 0.12em;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 700;
  `,
  headerLink: css`
    letter-spacing: 0.12em;
    font-size: 12px;
    color: rgba(120, 130, 255, 0.9);
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: rgba(120, 130, 255, 1);
    }
  `,
  list: css`
    width: 100%;
  `,
  row: css`
    width: 100%;
    background: rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 14px 16px;
  `,
  left: css`
    min-width: 0;
  `,
  rankWrap: css`
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  medal: css`
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
  `,
  rankText: css`
    font-size: 16px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.9);
  `,
  nameWrap: css`
    min-width: 0;
  `,
  name: css`
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.92);
  `,
  deals: css`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  `,
  amount: css`
    font-size: 14px;
    font-weight: 800;
    color: #2ecc71;
  `,
}));