"use client";
import { createStyles } from "antd-style";

export const useLoginStyles = createStyles(({ css }) => ({
  container: css`
    background: rgba(112, 112, 112, 0.6);
    width: 1100px;
    max-width: 70%;
    height: calc(100vh - 8.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rem;
    padding: 2rem 3rem;
    border: 1px solid #707070;
    backdrop-filter: blur(100px);
    border-radius: 15px;
    box-sizing: border-box;

    @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
      padding: 1.5rem;
      gap: 1.5rem;
    }
  `,
  leftSection: css`
    flex: 0 0 360px;
    color: #ffffff;
    font-size: 1.1rem;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 768px) {
      flex: none;
      width: 100%;
      text-align: center;
      font-size: 1rem;
    }
  `,
  welcomeTitle: css`
    font-family: 'Goblin One', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #ffffff;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  welcometext: css`
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  `,
  formWrapper: css`
    flex: 1;
    padding: 2rem;
    border: 1px solid rgba(112, 112, 112, 0.5);
    background: transparent;
    border-radius: 10px;
    max-width: 30rem;

    @media (max-width: 768px) {
      width: 100%;
      padding: 1.5rem;
    }
  `,
  formTitle: css`
    margin-bottom: 1rem !important;
    color: #ffffff !important;
    text-align: center;
    font-weight: 600;
    font-family: 'Goblin One', sans-serif;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  input: css`
    margin-bottom: 0.2rem;
    margin-top: 1rem;
    background-color: #707070;
    border: none;
    height: 2.2rem;
    color: #ffffff;

    &::placeholder {
      color: #d9d9d9;
    }

    &:hover,
    &:focus,
    &.ant-input-focused {
      border-color: #707070;
      box-shadow: none;
      background-color: #707070;
    }

    @media (max-width: 768px) {
      height: 2.2rem;
    }
  `,
  button: css`
    width: 100%;
    margin-top: 2rem;
    background-color: #707070;
    border: none;
    box-shadow: none !important;

    &:hover,
    &:focus {
      background-color: #70707081 !important;
      color: #ffffff;
      border: none !important;
    }
  `,
  signup: css`
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    color: #ffffff;

    &:hover {
      opacity: 0.85;
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  `,
}));