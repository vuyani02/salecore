"use client"
import { createStyles } from "antd-style";


export const useStyles = createStyles(({ css }) => ({
  layout: css`
    min-height: 100vh;
    background-color: #515151;
  `,
  content: css`
    padding-top: 0.5rem;
    padding-left: 1rem;
  `,
  logo: css`
    font-weight: bold;
    font-family: 'Goblin One', sans-serif;
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
  `,
  formContainer: css`
    width: 100%;
    margin-top: 2rem;
  `,
}));