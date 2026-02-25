"use client"
import React from "react";
import { Flex, Layout, Typography } from "antd";
import { useStyles } from "./styles/layoutstyle";

const { Title } = Typography;
const { Footer, Content } = Layout;

export default function EmptyLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Title level={2} className={styles.logo}>
          <span className={styles.sale}>Sale</span>
          <span className={styles.core}>core</span>
        </Title>

        <Flex justify="center" className={styles.formContainer}>{children}</Flex>
      </Content>

      <Footer className={styles.footer}>SaleCore © 2025</Footer>
    </Layout>
  );
}