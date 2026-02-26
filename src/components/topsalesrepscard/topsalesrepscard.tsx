"use client";
import React from "react";
import Link from "next/link";
import { Card, Flex, Typography } from "antd";
import {
  TrophyFilled,
  CrownFilled,
  StarFilled,
  RightOutlined,
} from "@ant-design/icons";
import { useTopSalesRepsCardStyles } from "./styles/topSalesRepsCardStyle";

const { Text } = Typography;

export type TopSalesRep = {
  name: string;
  deals: number;
  amountLabel: string;
};

export type TopSalesRepsCardProps = {
  reps: TopSalesRep[];
  leaderboardHref?: string;
};

const rankIcon = (rank: number) => {
  if (rank === 1) return <CrownFilled />;
  if (rank === 2) return <TrophyFilled />;
  if (rank === 3) return <StarFilled />;
  return null;
};

const TopSalesRepsCard = ({ reps, leaderboardHref = "/reports" }: TopSalesRepsCardProps) => {
  const { styles } = useTopSalesRepsCardStyles();

  return (
    <Card className={styles.card} variant="outlined">
      <Flex className={styles.header} align="center" justify="space-between">
        <Text className={styles.headerTitle}>TOP SALES REPS</Text>

        <Link href={leaderboardHref} className={styles.headerLink}>
          LEADERBOARD <RightOutlined />
        </Link>
      </Flex>

      <Flex vertical gap={12} className={styles.list}>
        {reps.slice(0, 5).map((rep, idx) => {
          const rank = idx + 1;
          const icon = rankIcon(rank);

          return (
            <Flex
              key={`${rep.name}-${rank}`}
              className={styles.row}
              align="center"
              justify="space-between"
            >
              <Flex align="center" gap={14} className={styles.left}>
                <Flex className={styles.rankWrap}>
                  {icon ? (
                    <span className={styles.medal}>{icon}</span>
                  ) : (
                    <span className={styles.rankText}>#{rank}</span>
                  )}
                </Flex>

                <Flex vertical style={{ minWidth: 0 }}>
                  <Text className={styles.name}>{rep.name}</Text>
                  <Text className={styles.deals}>{rep.deals} deals</Text>
                </Flex>
              </Flex>

              <Text className={styles.amount}>{rep.amountLabel}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Card>
  );
};

export default TopSalesRepsCard;