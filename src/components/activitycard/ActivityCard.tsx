"use client";
import React from "react";
import { Card, Flex, Typography } from "antd";
import { useActivityCardStyles } from "./styles/activityCardStyle";

const { Title, Text } = Typography;

export type ActivityCardProps = {
  upcomingCount: number;
  overdueCount: number;
  completedTodayCount: number;
};

export default function ActivityCard({
  upcomingCount,
  overdueCount,
  completedTodayCount,
}: ActivityCardProps) {
  const { styles } = useActivityCardStyles();

  const total = upcomingCount + overdueCount + completedTodayCount;

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="center" className={styles.titleRow}>
          <Title level={4} className={styles.title}>
            Activities
          </Title>
          <Text className={styles.pill}>{total} total</Text>
        </Flex>

        <Flex vertical gap={10} className={styles.list}>
          <Flex justify="space-between" align="center" className={styles.row}>
            <Flex align="center" gap={10} className={styles.left}>
              <span className={`${styles.dot} ${styles.dotUpcoming}`} />
              <Flex vertical>
                <Text className={styles.label}>Upcoming</Text>
                <Text className={styles.meta}>Due soon</Text>
              </Flex>
            </Flex>
            <Text className={styles.count}>{upcomingCount}</Text>
          </Flex>

          <Flex justify="space-between" align="center" className={styles.row}>
            <Flex align="center" gap={10} className={styles.left}>
              <span className={`${styles.dot} ${styles.dotOverdue}`} />
              <Flex vertical>
                <Text className={styles.label}>Overdue</Text>
                <Text className={styles.meta}>Needs attention</Text>
              </Flex>
            </Flex>
            <Text className={styles.count}>{overdueCount}</Text>
          </Flex>

          <Flex justify="space-between" align="center" className={styles.row}>
            <Flex align="center" gap={10} className={styles.left}>
              <span className={`${styles.dot} ${styles.dotCompleted}`} />
              <Flex vertical>
                <Text className={styles.label}>Completed Today</Text>
                <Text className={styles.meta}>Closed out</Text>
              </Flex>
            </Flex>
            <Text className={styles.count}>{completedTodayCount}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}