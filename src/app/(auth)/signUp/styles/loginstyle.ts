"use client";
import { createStyles } from "antd-style";

export const useLoginStyles = createStyles(({ css }) => ({
  container: css`
    background: rgba(112, 112, 112, 0.6);
    width: 900px;
    max-width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    padding: 3rem;
    border: 1px solid #707070;
    backdrop-filter: blur(100px);
    border-radius: 8px;
    margin-top: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
      padding: 2rem;
      gap: 2rem;
    }
  `,
  leftSection: css`
    flex: 1;
    color: #ffffff;
    font-size: 1.1rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      text-align: center;
      font-size: 1rem;
    }
  `,
  welcomeTitle: css`
    font-family: 'Goblin One', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  formWrapper: css`
    flex: 1;
    padding: 2rem;
    border: 1px solid #707070;
    background: transparent;
    border-radius: 8px;

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
    height: 2rem;

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

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  `,
  welcometext: css`
    font-size: 1rem;
    color: #fff;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  `,
}));