"use client";
import React from "react";
import { Card, Flex, Typography } from "antd";
import { FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useOpportunitiesCardStyles } from "./styles/opportunitiesCardStyle";

const { Title, Text } = Typography;

export type OpportunitiesCardProps = {
  totalOpportunities: number;
  dealsWon: number;
};

const OpportunitiesCard = ({
  totalOpportunities,
  dealsWon,
}: OpportunitiesCardProps) => {
  const { styles } = useOpportunitiesCardStyles();

  return (
    <Card className={styles.card} variant="outlined">
      <Flex vertical gap={16}>
        <Title level={4} className={styles.title}>
          Opportunities
        </Title>

        <Flex vertical gap={12}>
          <Flex className={styles.item} align="center" justify="space-between">
            <Flex align="center" gap={12}>
              <Flex className={styles.iconWrap}>
                <FileTextOutlined className={styles.icon} />
              </Flex>

              <Flex vertical>
                <Text className={styles.value}>{totalOpportunities}</Text>
                <Text className={styles.label}>Total Opportunities</Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex className={styles.item} align="center" justify="space-between">
            <Flex align="center" gap={12}>
              <Flex className={styles.iconWrap}>
                <CheckCircleOutlined className={styles.icon} />
              </Flex>

              <Flex vertical>
                <Text className={styles.value}>{dealsWon}</Text>
                <Text className={styles.label}>Deals Won</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default OpportunitiesCard;