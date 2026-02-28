"use client";
import { createStyles } from "antd-style";

export const useSignUpStyles = createStyles(({ css }) => ({
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

  welcometext: css`
    font-size: 1rem;
    color: #fff;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  `,

  scenarioSection: css`
    margin-top: 2.5rem;
  `,

  scenarioLabel: css`
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 11px !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700 !important;
  `,

  scenarioList: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  `,

  scenarioBtn: css`
    background: transparent;
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    width: 100%;

    &:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.05);
    }
  `,

  scenarioBtnActive: css`
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
  `,

  scenarioBtnLabel: css`
    color: rgba(255, 255, 255, 0.6);
    font-weight: 700;
    font-size: 13px;
    display: block;
  `,

  scenarioBtnLabelActive: css`
    color: #ffffff !important;
  `,

  scenarioBtnSubtitle: css`
    color: rgba(255, 255, 255, 0.35);
    font-size: 11px;
    margin-top: 2px;
    display: block;
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
    margin-bottom: 0.25rem !important;
    color: #ffffff !important;
    text-align: center;
    font-weight: 600;
    font-family: 'Goblin One', sans-serif;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,

  formSubtitle: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 12px !important;
    display: block;
    text-align: center;
    margin-bottom: 1.5rem !important;
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

  select: css`
    margin-top: 1rem;

    .ant-select-selector {
      background-color: #707070 !important;
      border: none !important;
      color: #ffffff !important;
      height: 2.2rem !important;
      display: flex;
      align-items: center;
    }

    .ant-select-selection-placeholder {
      color: #d9d9d9 !important;
    }

    .ant-select-selection-item {
      color: #ffffff !important;
    }
  `,

  fieldExtra: css`
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 11px !important;
  `,

  demoNotice: css`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 8px;
    padding: 10px 14px;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  `,

  demoNoticeText: css`
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 12px !important;
  `,

  demoNoticeHighlight: css`
    color: rgba(255, 255, 255, 0.75) !important;
    font-weight: 700 !important;
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