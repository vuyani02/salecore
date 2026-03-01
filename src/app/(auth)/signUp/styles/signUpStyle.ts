"use client";
import { createStyles } from "antd-style";

export const useSignUpStyles = createStyles(({ css }) => ({

  // ── Card container ────────────────────────────────────────────────────────
  container: css`
    background: rgba(112, 112, 112, 0.6);
    width: 1100px;
    max-width: 70%;
    height: calc(100vh - 7rem);
    display: flex;
    align-items: stretch;
    justify-content: space-btween !important;
    gap: 10rem;
    padding: 2rem 3rem;
    border: 1px solid #707070;
    backdrop-filter: blur(100px);
    border-radius: 25px;
    box-sizing: border-box;

    @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
      padding: 1.5rem;
      gap: 1.5rem;
    }
  `,

  // ── Left panel ────────────────────────────────────────────────────────────
  leftSection: css`
    flex: 0 0 360px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: #ffffff;
    overflow: hidden;

    @media (max-width: 768px) {
      flex: none;
      width: 100%;
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

  scenarioSection: css`
    margin-top: 2.5rem;
    width: 100%;
  `,

  scenarioLabel: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 10px !important;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700 !important;
  `,

  scenarioList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    width: 100%;
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
    color: rgba(255, 255, 255, 0.55);
    font-weight: 700;
    font-size: 13px;
    display: block;
  `,

  scenarioBtnLabelActive: css`
    color: #ffffff !important;
  `,

  scenarioBtnSubtitle: css`
    color: rgba(255, 255, 255, 0.3);
    font-size: 11px;
    margin-top: 3px;
    display: block;
    line-height: 1.4;
  `,

  // ── Right panel — form ────────────────────────────────────────────────────
  formWrapper: css`
    flex: 1;
    border: 1px solid rgba(112, 112, 112, 0.5);
    border-radius: 10px;
    padding: 2rem;
    overflow-y: auto;
    max-width: 30rem;

    scrollbar-width: thin;
    scrollbar-color: rgba(112, 112, 112, 0.5) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(112, 112, 112, 0.5);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(112, 112, 112, 0.8);
    }

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
  `,

  inputLocked: css`
    background-color: rgba(112, 112, 112, 0.4) !important;
    color: rgba(255, 255, 255, 0.5) !important;
    cursor: not-allowed !important;

    &:hover,
    &:focus {
      background-color: rgba(112, 112, 112, 0.4) !important;
      box-shadow: none !important;
    }
  `,

  select: css`
    margin-top: 1rem;
    width: 100%;

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

  selectLocked: css`
    opacity: 0.5;
    pointer-events: none;
  `,

  fieldExtra: css`
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 11px !important;
  `,

  inviteBanner: css`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(112, 112, 112, 0.35);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 1.5rem;
  `,

  inviteBannerText: css`
    color: rgba(255, 255, 255, 0.55) !important;
    font-size: 12px !important;
    line-height: 1.6 !important;
  `,

  inviteBannerHighlight: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 700 !important;
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
    color: rgba(255, 255, 255, 0.8) !important;
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
  `,
}));