"use client"
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  layout: css`
    height: 100vh;
    overflow: hidden;
    background-color: #515151;
    display: flex;
    flex-direction: column;
  `,

  content: css`
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  `,

  logo: css`
    font-weight: bold;
    font-family: 'Goblin One', sans-serif;
    flex-shrink: 0;
    margin-bottom: 0;
  `,

  sale: css`
    color: #ffffff;
  `,

  core: css`
    color: #707070;
  `,

  footer: css`
    text-align: center;
    color: #707070;
    background-color: #515151;
    flex-shrink: 0;
  `,

  formContainer: css`
    flex: 1;
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
  `,
}));