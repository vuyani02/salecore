"use client";
import { createStyles } from "antd-style";

export const useSettingsStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
  `,

  title: css`
    color: rgba(255, 255, 255, 0.9) !important;
    margin-bottom: 0 !important;
  `,

  // ── Sub-nav tabs ──────────────────────────────────────────────────────────
  tabBar: css`
    display: flex;
    gap: 0;
    border-bottom: 1px solid rgba(112, 112, 112, 0.35);
    margin-bottom: 24px;
  `,

  tab: css`
    padding: 10px 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
    background: transparent;
    border-top: none;
    border-left: none;
    border-right: none;

    &:hover {
      color: rgba(255, 255, 255, 0.75);
    }
  `,

  tabActive: css`
    color: rgba(255, 255, 255, 0.95) !important;
    border-bottom-color: #ffffff !important;
  `,

  // ── Shared card ───────────────────────────────────────────────────────────
  card: css`
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(112, 112, 112, 0.35) !important;
    border-radius: 12px !important;
  `,

  // ── Profile tab ───────────────────────────────────────────────────────────
  avatarWrap: css`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #707070;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    flex-shrink: 0;
  `,

  profileName: css`
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 700 !important;
    margin-bottom: 2px !important;
  `,

  profileRole: css`
    color: rgba(255, 255, 255, 0.45) !important;
    font-size: 12px !important;
  `,

  sectionTitle: css`
    color: rgba(255, 255, 255, 0.55) !important;
    font-size: 10px !important;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700 !important;
    margin-bottom: 12px !important;
  `,

  infoRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(112, 112, 112, 0.2);

    &:last-child {
      border-bottom: none;
    }
  `,

  infoLabel: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 12px !important;
  `,

  infoValue: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  `,

  tenantIdWrap: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  tenantId: css`
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    font-family: monospace !important;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 6px;
    padding: 3px 10px;
  `,

  copyBtn: css`
    background-color: #707070 !important;
    border: none !important;
    box-shadow: none !important;
    color: #ffffff !important;
    font-weight: 600;

    &:hover,
    &:focus {
      background-color: #70707081 !important;
      color: #ffffff !important;
      border: none !important;
    }
  `,

  // ── Invite tab ────────────────────────────────────────────────────────────
  inviteTitle: css`
    color: rgba(255, 255, 255, 0.9) !important;
    margin-bottom: 4px !important;
  `,

  inviteSubtitle: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 13px !important;
    margin-bottom: 0 !important;
  `,

  inviteInput: css`
    background-color: #707070 !important;
    border: none !important;
    color: #ffffff !important;
    height: 2.2rem;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    &:hover,
    &:focus {
      box-shadow: none !important;
      background-color: #707070 !important;
    }
  `,

  inviteSelect: css`
    .ant-select-selector {
      background-color: #707070 !important;
      border: none !important;
      color: #ffffff !important;
      height: 2.2rem !important;
      display: flex;
      align-items: center;
    }

    .ant-select-selection-placeholder {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    .ant-select-selection-item {
      color: #ffffff !important;
    }
  `,

  sendBtn: css`
    background-color: #707070 !important;
    border: none !important;
    box-shadow: none !important;
    color: #ffffff !important;
    font-weight: 600;
    height: 2.2rem;

    &:hover,
    &:focus {
      background-color: #70707081 !important;
      color: #ffffff !important;
      border: none !important;
    }
  `,

  sentItem: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(112, 112, 112, 0.2);

    &:last-child {
      border-bottom: none;
    }
  `,

  sentEmail: css`
    color: rgba(255, 255, 255, 0.8) !important;
    font-size: 13px !important;
  `,

  sentRole: css`
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 12px !important;
  `,

  sentTime: css`
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 11px !important;
  `,
}));