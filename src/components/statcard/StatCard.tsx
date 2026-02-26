"use client";
import React from "react";
import { Card, Flex, Typography } from "antd";
import { useStatCardStyles } from "./styles/statCardStyle";

const { Text } = Typography;

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  subTone?: "danger";
};

export default function StatCard({
  icon,
  value,
  label,
  sub,
  subTone,
}: StatCardProps) {
  const { styles } = useStatCardStyles();

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={6}>
        <Flex justify="space-between" align="center">
          <Text className={styles.icon}>{icon}</Text>
        </Flex>

        <Text className={styles.value}>{value}</Text>
        <Text className={styles.label}>{label}</Text>

        {sub ? (
          <Text
            className={
              subTone === "danger"
                ? `${styles.sub} ${styles.danger}`
                : styles.sub
            }
          >
            {sub}
          </Text>
        ) : null}
      </Flex>
    </Card>
  );
}