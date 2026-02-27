"use client";
import React from "react";
import { Layout, Flex, Typography } from "antd";
import NavBar from "../../components/navbar/NavBar";
import { useMainLayoutStyles } from "./styles/layoutStyle";

const { Content, Footer } = Layout;
const { Text } = Typography;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useMainLayoutStyles();

  return (
    <Layout className={styles.layout} hasSider>

      {/* Fixed sidebar */}
      <NavBar />

      {/* Main content — offset by sidebar width */}
      <div className={styles.siderOffset}>
        <Content className={styles.content}>
                {children}
        </Content>

        <Footer className={styles.footer}>
          <Text className={styles.footerText}>Salecore © 2025</Text>
        </Footer>
      </div>

    </Layout>
  );
}