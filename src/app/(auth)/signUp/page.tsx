"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, Select, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUpStyles } from "./styles/signUpStyle";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { RegisterPayload, AuthResponse } from "../../../types/auth";

const { Title, Text } = Typography;
const { Option } = Select;

type Scenario = "new" | "join" | "demo";

const SCENARIOS: { key: Scenario; label: string; subtitle: string }[] = [
  {
    key:      "new",
    label:    "New Organisation",
    subtitle: "Create your own workspace — you become the Admin",
  },
  {
    key:      "join",
    label:    "Join Organisation",
    subtitle: "Join an existing team using a Tenant ID",
  },
  {
    key:      "demo",
    label:    "Demo Access",
    subtitle: "Explore the system on the shared demo workspace",
  },
];

export default function SignUpPage() {
  const { styles, cx } = useSignUpStyles();
  const router         = useRouter();
  const [loading,   setLoading]  = useState(false);
  const [scenario,  setScenario] = useState<Scenario>("new");
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: RegisterPayload = {
        email:     values.email.trim(),
        password:  values.password,
        firstName: values.firstName.trim(),
        lastName:  values.lastName.trim(),
      };

      if (values.phoneNumber?.trim())
        payload.phoneNumber = values.phoneNumber.trim();

      if (scenario === "new" && values.tenantName?.trim())
        payload.tenantName = values.tenantName.trim();

      if (scenario === "join") {
        payload.tenantId = values.tenantId.trim();
        if (values.role) payload.role = values.role;
      }

      if (scenario === "demo" && values.role)
        payload.role = values.role;

      const api = getAxiosInstance();
      const res = await api.post<AuthResponse>("/api/auth/register", payload);
      const auth = res.data;

      localStorage.setItem("auth_token", auth.token);
      localStorage.setItem("user_role",  auth.roles?.[0] || "");
      localStorage.setItem("tenant_id",  auth.tenantId);

      message.success("Account created successfully");
      router.push("/dashboard");
    } catch (err: any) {
      message.error(
        err?.response?.data?.title  ||
        err?.response?.data?.detail ||
        "Sign up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioChange = (key: Scenario) => {
    setScenario(key);
    form.resetFields(["tenantName", "tenantId", "role"]);
  };

  const active = SCENARIOS.find((s) => s.key === scenario)!;

  return (
    <div className={styles.container}>

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className={styles.leftSection}>
        <div className={styles.welcomeTitle}>Welcome to Salecore.</div>
        <Text className={styles.welcometext}>
          Sign up to manage your pipeline, track opportunities, and close more deals.
        </Text>

        <div className={styles.scenarioSection}>
          <Text className={styles.scenarioLabel}>Choose sign-up type</Text>
          <div className={styles.scenarioList}>
            {SCENARIOS.map(({ key, label, subtitle }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleScenarioChange(key)}
                className={cx(styles.scenarioBtn, scenario === key && styles.scenarioBtnActive)}
              >
                <span className={cx(styles.scenarioBtnLabel, scenario === key && styles.scenarioBtnLabelActive)}>
                  {label}
                </span>
                <span className={styles.scenarioBtnSubtitle}>{subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      <div className={styles.formWrapper}>
        <Title level={3} className={styles.formTitle}>{active.label}</Title>
        <Text className={styles.formSubtitle}>{active.subtitle}</Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>

          {/* Common fields */}
          <Form.Item name="firstName" rules={[{ required: true, message: "First name is required" }]}>
            <Input placeholder="First Name" className={styles.input} />
          </Form.Item>

          <Form.Item name="lastName" rules={[{ required: true, message: "Last name is required" }]}>
            <Input placeholder="Last Name" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Email" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password placeholder="Password" className={styles.input} />
          </Form.Item>

          <Form.Item name="phoneNumber">
            <Input placeholder="Phone Number (Optional)" className={styles.input} />
          </Form.Item>

          {/* Scenario A — New Organisation */}
          {scenario === "new" && (
            <Form.Item
              name="tenantName"
              rules={[{ required: true, message: "Organisation name is required" }]}
            >
              <Input placeholder="Organisation Name" className={styles.input} />
            </Form.Item>
          )}

          {/* Scenario B — Join Organisation */}
          {scenario === "join" && (
            <>
              <Form.Item
                name="tenantId"
                rules={[{ required: true, message: "Tenant ID is required" }]}
                extra={<Text className={styles.fieldExtra}>Ask your organisation Admin for the Tenant ID</Text>}
              >
                <Input placeholder="Tenant ID" className={styles.input} />
              </Form.Item>

              <Form.Item
                name="role"
                rules={[{ required: true, message: "Please select a role" }]}
                extra={<Text className={styles.fieldExtra}>You cannot join as Admin</Text>}
              >
                <Select placeholder="Select Role" className={styles.select} allowClear>
                  <Option value="SalesRep">Sales Rep</Option>
                  <Option value="SalesManager">Sales Manager</Option>
                  <Option value="BusinessDevelopmentManager">Business Development Manager</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* Scenario C — Demo Workspace */}
          {scenario === "demo" && (
            <>
              <div className={styles.demoNotice}>
                <Text className={styles.demoNoticeText}>
                  You'll be added to the{" "}
                  <Text className={styles.demoNoticeHighlight}>shared demo workspace</Text>.
                  All data here is visible to other demo users.
                </Text>
              </div>

              <Form.Item name="role">
                <Select placeholder="Select Role (Optional)" className={styles.select} allowClear>
                  <Option value="SalesRep">Sales Rep</Option>
                  <Option value="SalesManager">Sales Manager</Option>
                  <Option value="BusinessDevelopmentManager">Business Development Manager</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            className={styles.button}
            loading={loading}
          >
            {scenario === "new"  && "Create Organisation & Sign Up"}
            {scenario === "join" && "Join Organisation"}
            {scenario === "demo" && "Access Demo Workspace"}
          </Button>

        </Form>

        <Link href="/login" className={styles.signup}>
          Already have an account? Log in
        </Link>
      </div>

    </div>
  );
}