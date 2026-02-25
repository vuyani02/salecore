"use client";
import { Form, Input, Button, Typography } from "antd";
import Link from "next/link";
import { useLoginStyles } from "./styles/loginstyle";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { styles } = useLoginStyles();

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

          <Form layout="vertical">
            <Form.Item name="name" rules={[{ required: true, message: "Name is required"  }]}>
              <Input placeholder="Name" className={styles.input} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Password is required"  }]}>
              <Input.Password placeholder="Password" className={styles.input} />
            </Form.Item>

            <Button type="primary" htmlType="submit" className={styles.button}>
              Log in
            </Button>
          </Form>

          <Link href="/signUp" className={styles.signup}>
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
  );
}