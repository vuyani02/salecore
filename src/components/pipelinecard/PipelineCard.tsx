"use client";
import React from "react";
import { Card, Flex, Typography, Badge } from "antd";
import { usePipelineCardStyles } from "./styles/pipelineCardStyle";

const { Title, Text } = Typography;

export type PipelineStage = {
  name: string;
  count: number;
  tone: "prospect" | "qualified" | "proposal" | "negotiation" | "won";
  size: "s12" | "s9" | "s8" | "s6" | "s17";
};

type PipelineCardProps = {
  stages: PipelineStage[];
};

export default function PipelineCard({ stages }: PipelineCardProps) {
  const { styles } = usePipelineCardStyles();

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={16}>
        <Title level={4} className={styles.title}>
          Pipeline Stages
        </Title>

        <Flex className={styles.bar} gap={6}>
          {stages.map(({ name, tone, size }) => (
            <Flex
              key={name}
              className={`${styles.segment} ${styles[tone]} ${styles[size]}`}
            />
          ))}
        </Flex>

        <Flex wrap gap={20}>
          {stages.map(({ name, count, tone }) => (
            <Flex key={name} align="center" gap={8}>
              <Badge className={`${styles.badge} ${styles[`badge_${tone}`]}`} />
              <Text className={styles.legendText}>
                {name} <Text className={styles.legendCount}>{count}</Text>
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}