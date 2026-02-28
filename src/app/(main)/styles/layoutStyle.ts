"use client";
import { createStyles } from "antd-style";

export const useMainLayoutStyles = createStyles(({ css }) => ({
  layout: css`
    min-height: 100vh;
    background: #515151;
  `,

  siderOffset: css`
    margin-left: 22rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `,

  content: css`
    flex: 1;
    padding: 18px 24px;
    min-width: 70rem;
  `,

  center: css`
    width: 100%;
  `,

  shell: css`
    width: 100%;
  `,

  panel: css`
    width: 100%;
    background: rgba(112, 112, 112, 0.6);
    border: 1px solid rgba(112, 112, 112, 0.75);
    border-radius: 8px;
    padding: 3rem;
  `,

  footer: css`
    background: transparent;
    padding: 18px 0 22px;
    text-align: center;
  `,

  footerText: css`
    color: rgba(255, 255, 255, 0.25);
    font-weight: 600;
  `,
}));