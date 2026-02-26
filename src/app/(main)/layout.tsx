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
    <Layout className={styles.layout}>
      <NavBar />

      <Content className={styles.content}>
        <Flex justify="center" className={styles.center}>
          <Flex vertical className={styles.shell}>
            <Flex vertical className={styles.panel}>
              {children}
            </Flex>
          </Flex>
        </Flex>
      </Content>

      <Footer className={styles.footer}>
        <Text className={styles.footerText}>Salecore @ 2025</Text>
      </Footer>
    </Layout>
  );
}