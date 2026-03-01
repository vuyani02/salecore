"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginStyles } from "./styles/loginstyle";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { LoginPayload, AuthResponse } from "@/types/auth";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { styles } = useLoginStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: LoginPayload = {
        email:    String(values.email || "").trim(),
        password: String(values.password || ""),
      };

      const api  = getAxiosInstance();
      const res  = await api.post<AuthResponse>("/api/auth/login", payload);
      const auth = res.data;

      localStorage.setItem("auth_token", auth.token);
      localStorage.setItem("user_role",  auth.roles?.[0] || "");
      localStorage.setItem("user_email", auth.email || "");
      localStorage.setItem("user_id",    auth.userId || "");
      localStorage.setItem("tenant_id",  auth.tenantId || "");
      localStorage.setItem("first_name", auth.firstName || "");
      localStorage.setItem("last_name",  auth.lastName || "");

      message.success("Logged in");
      router.push("/dashboard");
    } catch (e: any) {
      const msg =
        e?.response?.data?.title  ||
        e?.response?.data?.detail ||
        e?.message                ||
        "Login failed";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.welcomeTitle}>Welcome to Salecore.</div>
        <Text className={styles.welcometext}>
          Log in to manage your pipeline, track opportunities, and close more deals.
        </Text>
      </div>

      <div className={styles.formWrapper}>
        <Title level={3} className={styles.formTitle}>
          Log in
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
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
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Password" className={styles.input} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className={styles.button}
            loading={loading}
          >
            Log in
          </Button>
        </Form>

        <Link href="/signUp" className={styles.signup}>
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}