"use client";
import { createStyles } from "antd-style";

export const useNavBarStyles = createStyles(({ css }) => ({
  sider: css`
    background: rgba(112, 112, 112, 0.6) !important;
    border-right: 1px solid rgba(112, 112, 112, 0.8) !important;
    height: 100vh;
    position: fixed !important;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  `,

  logoWrap: css`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    border-bottom: 1px solid rgba(112, 112, 112, 0.5);
    flex-shrink: 0;
  `,

  logo: css`
    margin: 0 !important;
    font-family: 'Goblin One', sans-serif;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  `,

  sale: css`
    color: #ffffff;
  `,

  core: css`
    color: #707070;
  `,

  nav: css`
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  `,

  navItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  `,

  navItemActive: css`
    background: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;
  `,

  navIcon: css`
    font-size: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
  `,

  navLabel: css`
    flex: 1;
    line-height: 1;
  `,
}));