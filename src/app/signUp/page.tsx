"use client";
import { Form, Input, Button, Typography, Select } from "antd";
import Link from "next/link";
import { useLoginStyles } from "./styles/loginstyle";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SignUpPage() {
  const { styles } = useLoginStyles();

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

        <Form layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Name" className={styles.input} />
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

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select placeholder="Select Role" className={styles.input}>
              <Option value="admin">Admin</Option>
              <Option value="sales">Sales</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" className={styles.button}>
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