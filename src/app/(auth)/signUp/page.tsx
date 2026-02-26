"use client";
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

export default function SignUpPage() {
  const { styles } = useSignUpStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const payload: RegisterPayload = {
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      };

      if (values.phoneNumber?.trim())
        payload.phoneNumber = values.phoneNumber.trim();

      if (values.tenantName?.trim())
        payload.tenantName = values.tenantName.trim();

      if (values.tenantId?.trim())
        payload.tenantId = values.tenantId.trim();

      if (values.role)
        payload.role = values.role;

      const api = getAxiosInstance();
      const res = await api.post<AuthResponse>(
        "/api/auth/register",
        payload
      );

      const auth = res.data;
      console.log(auth);

      localStorage.setItem("auth_token", auth.token);
      localStorage.setItem("user_role", auth.roles?.[0] || "");
      localStorage.setItem("tenant_id", auth.tenantId);

      message.success("Account created successfully");
      router.push("/dashboard");
    } catch (err: any) {
      message.error(
        err?.response?.data?.title ||
        err?.response?.data?.detail ||
        "Sign up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.welcomeTitle}>Welcome to Salecore.</div>
        <Text className={styles.welcometext}>
          Sign up to manage your pipeline, track opportunities, and close more deals.
        </Text>
      </div>

      <div className={styles.formWrapper}>
        <Title level={3} className={styles.formTitle}>
          Sign Up
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input placeholder="First Name" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input placeholder="Last Name" className={styles.input} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Email" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Password" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input placeholder="Phone Number" className={styles.input} />
          </Form.Item>

          <Form.Item name="tenantName">
            <Input placeholder="Organisation Name (Optional)" className={styles.input} />
          </Form.Item>

          <Form.Item name="tenantId">
            <Input placeholder="Tenant ID (Optional)" className={styles.input} />
          </Form.Item>

          <Form.Item name="role">
            <Select placeholder="Select Role (Optional)" className={styles.select} allowClear>
              <Option value="SalesRep">Sales Rep</Option>
              <Option value="SalesManager">Sales Manager</Option>
              <Option value="BusinessDevelopmentManager">
                Business Development Manager
              </Option>
            </Select>
          </Form.Item>

         <Button
            type="primary"
            htmlType="submit"
            className={styles.button}
            loading={loading}
          >
            Sign Up
          </Button>
        </Form>

        <Link href="/login" className={styles.signup}>
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}