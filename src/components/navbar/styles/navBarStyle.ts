"use client";
import { createStyles } from "antd-style";

export const useNavBarStyles = createStyles(({ css }) => ({
  header: css`
    padding: 0;
    background: rgba(112, 112, 112, 0.6);
    border-bottom: 1px solid rgba(112, 112, 112, 0.8);
  `,
  inner: css`
    height: 64px;
    width: 100%;
    padding: 0 24px;
  `,
  logo: css`
    margin: 0 !important;
    font-family: 'Goblin One', sans-serif;
    font-weight: 700;
    line-height: 1;
  `,
  sale: css`
    color: #ffffff;
  `,
  core: css`
    color: #707070;
  `,
  nav: css`
    opacity: 0.75;
  `,
  link: css`
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  `,
  avatar: css`
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(112, 112, 112, 0.9);
    color: rgba(255, 255, 255, 0.9);
  `,
}));