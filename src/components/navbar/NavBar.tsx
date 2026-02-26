"use client";
import { Layout, Typography, Flex, Avatar } from "antd";
import Link from "next/link";
import { useNavBarStyles } from "./styles/navBarStyle";

const { Header } = Layout;
const { Title } = Typography;

export default function NavBar() {
  const { styles } = useNavBarStyles();

  return (
    <Header className={styles.header}>
      <Flex align="center" justify="space-between" className={styles.inner}>
        <Title level={2} className={styles.logo}>
          <span className={styles.sale}>Sale</span>
          <span className={styles.core}>core</span>
        </Title>

        <Flex align="center" gap={28} className={styles.nav}>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
          <Link href="/clients" className={styles.link}>Clients</Link>
          <Link href="/Opportunities" className={styles.link}>Opportunities</Link>
          <Link href="/contracts" className={styles.link}>Contracts</Link>
          <Link href="/activities" className={styles.link}>Activities</Link>
        </Flex>

        <Avatar className={styles.avatar}>P</Avatar>
      </Flex>
    </Header>
  );
}