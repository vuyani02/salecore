"use client";
import React from "react";
import { Card, Flex, Typography, Badge } from "antd";
import { usePipelineCardStyles } from "./styles/pipelineCardStyle";

const { Title, Text } = Typography;

export type PipelineStage = {
  name: string;
  count: number;
  color: string;
  flex: number;
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
          {stages.map(({ name, flex, color }) => (
            <Flex
              key={name}
              className={styles.segment}
              style={{ flex, backgroundColor: color }}
            />
          ))}
        </Flex>

        <Flex wrap gap={20}>
          {stages.map(({ name, count, color }) => (
            <Flex key={name} align="center" gap={8}>
              <Badge color={color} />
              <Text className={styles.legendText}>
                {name}{" "}
                <Text className={styles.legendCount}>{count}</Text>
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}