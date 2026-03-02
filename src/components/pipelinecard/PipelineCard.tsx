"use client";
import React from "react";
import { Card, Flex, Typography } from "antd";
import { usePipelineCardStyles } from "./styles/pipelineCardStyle";

const { Title, Text } = Typography;

export type PipelineTone =
  | "prospect"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type PipelineStage = {
  name: string;
  count: number;
  tone: PipelineTone;
};

type PipelineCardProps = {
  stages: PipelineStage[];
  weightedPipelineValue?: string;
};

export default function PipelineCard({ stages, weightedPipelineValue }: PipelineCardProps) {
  const { styles } = usePipelineCardStyles();

  const totalCount = stages.reduce((acc, s) => acc + s.count, 0);

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={16}>

        {/* Header row — title + weighted value */}
        <Flex justify="space-between" align="center">
          <Title level={4} className={styles.title}>
            Pipeline Stages
          </Title>
          {weightedPipelineValue && (
            <Flex vertical align="flex-end" className={styles.weightedContainer}>
              <Text className={styles.weightedLabel}>Weighted Pipeline Value</Text>
              <Text className={styles.weightedValue}>{weightedPipelineValue}</Text>
            </Flex>
          )}
        </Flex>

        {/* Progress bar */}
        <Flex className={styles.bar}>
          {stages.map(({ name, tone, count }) => {
            const width = totalCount > 0 ? `${(count / totalCount) * 100}%` : "0%";
            return (
              <div
                key={name}
                className={`${styles.segment} ${styles[tone]}`}
                style={{ width }}
              />
            );
          })}
        </Flex>

        {/* Legend */}
        <Flex wrap gap={20}>
          {stages.map(({ name, count, tone }) => (
            <Flex key={name} align="center" gap={8}>
              <span className={`${styles.dot} ${styles[tone]}`} />
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