"use client";
import { createStyles } from "antd-style";

export const useLoginStyles = createStyles(({ css }) => ({
  wrapper: css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #515151;
  `,
  container: css`
    width: 900px;
    max-width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    padding: 3rem;
    border: 1px solid #707070;
    background: rgba(112, 112, 112, 0.6);
    backdrop-filter: blur(100px);
    border-radius: 8px;
  `,
  leftSection: css`
    flex: 1;
    color: #ffffff;
    font-size: 1.1rem;
    line-height: 1.6;
  `,
  welcomeTitle: css`
    font-family: 'Goblin One', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
  `,
  formWrapper: css`
    flex: 1;
    padding: 2rem;
    border: 1px solid #707070;
    background: transparent;
    border-radius: 8px;
  `,
  formTitle: css`
    margin-bottom: 2rem;
    color: #ffffff;
  `,
  input: css`
    margin-bottom: 1rem;
  `,
  button: css`
    width: 100%;
    margin-top: 1rem;
  `,
  signup: css`
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    color: #ffffff;
  `,
}));