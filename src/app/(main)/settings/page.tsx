"use client";

import React, { useEffect, useState } from "react";
import {
  Button, Card, Col, Flex, Form, Input,
  Row, Select, Tag, Tooltip, Typography, message,
} from "antd";
import {
  CopyOutlined, MailOutlined, SendOutlined, CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import emailjs from "@emailjs/browser";
import { useSettingsStyles } from "./styeles/Settingsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const EMAILJS_SERVICE_ID  = "service_e0qgyuw";
const EMAILJS_TEMPLATE_ID = "g71u691";
const EMAILJS_PUBLIC_KEY  = "fUX4R5Wp_hfwEgKeW";
const APP_URL             = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ISentInvite {
  email: string;
  role: string;
  sentAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const ROLE_LABELS: Record<string, string> = {
  Admin:                        "Admin",
  SalesManager:                 "Sales Manager",
  SalesRep:                     "Sales Rep",
  BusinessDevelopmentManager:   "Business Development Manager",
};

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = ({ styles }: { styles: any }) => {
  const [copied,  setCopied]  = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const instance = getAxiosInstance();

  useEffect(() => {
    instance.get("/api/auth/me")
      .then((res) => {
        const data   = res.data;
        const claims = data.claims ?? [];

        const getClaim = (type: string) =>
          claims.find((c: any) => c.type === type)?.value ?? "";

        const firstName = getClaim("firstName");
        const lastName  = getClaim("lastName");
        const tenantId  = getClaim("tenantId");

        setProfile({
          firstName,
          lastName,
          email:    data.email,
          role:     data.roles?.[0] ?? "",
          tenantId,
        });

        // Sync to localStorage
        localStorage.setItem("first_name", firstName);
        localStorage.setItem("last_name",  lastName);
        localStorage.setItem("user_email", data.email   || "");
        localStorage.setItem("user_role",  data.roles?.[0] || "");
        localStorage.setItem("tenant_id",  tenantId);
      })
      .catch(() => {
        setProfile({
          firstName: localStorage.getItem("first_name") ?? "",
          lastName:  localStorage.getItem("last_name")  ?? "",
          email:     localStorage.getItem("user_email") ?? "—",
          role:      localStorage.getItem("user_role")  ?? "—",
          tenantId:  localStorage.getItem("tenant_id")  ?? "—",
        });
      });
  }, []);

  const firstName = profile?.firstName ?? "";
  const lastName  = profile?.lastName  ?? "";
  const email     = profile?.email     ?? "—";
  const role      = profile?.role      ?? localStorage.getItem("user_role") ?? "—";
  const tenantId  = profile?.tenantId  ?? localStorage.getItem("tenant_id") ?? "—";

  const initials = firstName || lastName
    ? `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const displayName = firstName || lastName
    ? `${firstName} ${lastName}`.trim()
    : "—";

  const handleCopy = () => {
    navigator.clipboard.writeText(tenantId);
    setCopied(true);
    message.success("Tenant ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex vertical gap={20}>

      {/* Avatar + name */}
      <Card className={styles.card}>
        <Flex align="center" gap={16} style={{ padding: "4px 0" }}>
          <div className={styles.avatarWrap}>
            {initials}
          </div>
          <Flex vertical gap={4}>
            <Title level={4} className={styles.profileName}>
              {displayName}
            </Title>
            <Tag
              style={{
                background:    "rgba(112,112,112,0.2)",
                border:        "1px solid rgba(112,112,112,0.35)",
                color:         "rgba(255,255,255,0.7)",
                borderRadius:  4,
                width:         "fit-content",
                marginInlineEnd: 0,
              }}
            >
              {ROLE_LABELS[role] ?? role}
            </Tag>
          </Flex>
        </Flex>
      </Card>

      {/* Account details */}
      <Card className={styles.card}>
        <Text className={styles.sectionTitle}>Account Details</Text>

        <div className={styles.infoRow}>
          <Text className={styles.infoLabel}>Email</Text>
          <Text className={styles.infoValue}>{email}</Text>
        </div>

        <div className={styles.infoRow}>
          <Text className={styles.infoLabel}>Role</Text>
          <Text className={styles.infoValue}>{ROLE_LABELS[role] ?? role}</Text>
        </div>

        <div className={styles.infoRow}>
          <Text className={styles.infoLabel}>Organisation ID</Text>
          <div className={styles.tenantIdWrap}>
            <Text className={styles.tenantId}>{tenantId}</Text>
            <Tooltip title={copied ? "Copied!" : "Copy Tenant ID"}>
              <Button
                size="small"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                className={styles.copyBtn}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Tooltip>
          </div>
        </div>
      </Card>

    </Flex>
  );
};

// ── Invite Tab ────────────────────────────────────────────────────────────────
const InviteTab = ({ styles }: { styles: any }) => {
  const [form]       = Form.useForm();
  const [sending,    setSending]   = useState(false);
  const [sentList,   setSentList]  = useState<ISentInvite[]>([]);

  const tenantId = typeof window !== "undefined"
    ? localStorage.getItem("tenant_id") ?? ""
    : "";

  const handleSend = async (values: any) => {
    setSending(true);
    const { email, role } = values;
    const inviteUrl = `${APP_URL}/signup?tenantId=${tenantId}&role=${role}&email=${encodeURIComponent(email)}`;
    const roleLabel = ROLE_LABELS[role] ?? role;

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#515151;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#515151;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:rgba(80,80,80,0.9);border:1px solid #707070;border-radius:12px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px 20px;border-bottom:1px solid rgba(112,112,112,0.4);">
                      <p style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                        <span style="color:#ffffff;">Sale</span><span style="color:#9a9a9a;">core</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px 40px;">
                      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">
                        You've been invited
                      </p>
                      <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;">
                        You've been invited to join an organisation on <strong style="color:rgba(255,255,255,0.8);">Salecore</strong> as a <strong style="color:rgba(255,255,255,0.8);">${roleLabel}</strong>. Click the button below to create your account and get started.
                      </p>

                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                        <tr>
                          <td style="background:#707070;border-radius:8px;">
                            <a href="${inviteUrl}"
                               style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                              Join Organisation →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.6;">
                        If you weren't expecting this invite, you can safely ignore this email. The link will remain active until used.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:16px 40px;border-top:1px solid rgba(112,112,112,0.3);">
                      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);text-align:center;">
                        SaleCore © ${new Date().getFullYear()} · Sent via Salecore Invite System
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:     email,
          html_content: html,
          name:         "Salecore",
          email:        "noreplysalecore@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log("✅ EmailJS result:", result);

      message.success(`Invite sent to ${email}`);
      setSentList((prev) => [{ email, role, sentAt: new Date().toISOString() }, ...prev]);
      form.resetFields();
    } catch (err: any) {
      console.error("❌ EmailJS error:", err?.status, err?.text, JSON.stringify(err));
      message.error(err?.text ?? err?.message ?? "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  return (
    <Flex vertical gap={20}>

      {/* Send invite form */}
      <Card className={styles.card}>
        <Flex vertical gap={4} style={{ marginBottom: 20 }}>
          <Title level={5} className={styles.inviteTitle}>Invite a Team Member</Title>
          <Text className={styles.inviteSubtitle}>
            They'll receive an email with a personalised link to join your organisation.
          </Text>
        </Flex>

        <Form form={form} layout="vertical" onFinish={handleSend}>
          <Row gutter={12} align="bottom">
            <Col flex="auto">
              <Form.Item
                name="email"
                label={<Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Email Address</Text>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
                  placeholder="colleague@company.com"
                  className={styles.inviteInput}
                />
              </Form.Item>
            </Col>
            <Col flex="180px">
              <Form.Item
                name="role"
                label={<Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Role</Text>}
                rules={[{ required: true, message: "Select a role" }]}
                style={{ marginBottom: 0 }}
              >
                <Select placeholder="Select role" className={styles.inviteSelect}>
                  <Option value="SalesRep">Sales Rep</Option>
                  <Option value="SalesManager">Sales Manager</Option>
                  <Option value="BusinessDevelopmentManager">BDM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={sending}
                  className={styles.sendBtn}
                >
                  Send Invite
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Sent invites history */}
      {sentList.length > 0 && (
        <Card className={styles.card}>
          <Text className={styles.sectionTitle}>Sent This Session</Text>
          {sentList.map((inv, i) => (
            <div key={i} className={styles.sentItem}>
              <Flex vertical gap={2}>
                <Text className={styles.sentEmail}>{inv.email}</Text>
                <Text className={styles.sentRole}>{ROLE_LABELS[inv.role] ?? inv.role}</Text>
              </Flex>
              <Text className={styles.sentTime}>{dayjs(inv.sentAt).fromNow()}</Text>
            </div>
          ))}
        </Card>
      )}

    </Flex>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
type Tab = "profile" | "invite";

const SettingsPage = () => {
  const { styles, cx } = useSettingsStyles();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Title level={3} className={styles.title}>Settings</Title>

      {/* Sub-nav tabs */}
      <div className={styles.tabBar}>
        {(["profile", "invite"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cx(styles.tab, activeTab === tab && styles.tabActive)}
          >
            {tab === "profile" ? "Profile" : "Invite"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile" && <ProfileTab styles={styles} />}
      {activeTab === "invite"  && <InviteTab  styles={styles} />}

    </Flex>
  );
};

export default SettingsPage;