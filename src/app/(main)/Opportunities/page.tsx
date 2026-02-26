"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Flex, Tabs, Typography, Button, Table, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useOpportunitiesActions, useOpportunitiesState } from "@/providers/opportunitiesProvider/";
import { useOpportunitiesPageStyles } from "./styeles/useOpportunitiesStyles";
import type { Opportunity } from "@/types/opportunities";

const { Title } = Typography;

const stageColor = (stage: number) => {
  if (stage === 1) return "purple";
  if (stage === 2) return "blue";
  if (stage === 3) return "gold";
  if (stage === 4) return "cyan";
  if (stage === 5) return "green";
  if (stage === 6) return "red";
  return "default";
};

const canDelete = () => {
  try {
    const raw = localStorage.getItem("roles");
    if (!raw) return false;
    const roles = JSON.parse(raw) as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch {
    return false;
  }
};

const OpportunitiesPage = () => {
  const { styles } = useOpportunitiesPageStyles();
  const state = useOpportunitiesState();
  const { getOpportunities, getMyOpportunities, deleteOpportunity } = useOpportunitiesActions();
  const [tab, setTab] = useState<"all" | "mine">("all");

  useEffect(() => {
    getOpportunities({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    if (tab === "all") getOpportunities({ pageNumber: 1, pageSize: 10 });
    if (tab === "mine") getMyOpportunities({ pageNumber: 1, pageSize: 10 });
  }, [tab]);

  const data = tab === "all" ? state.opportunities : state.myOpportunities;

  const columns: ColumnsType<Opportunity> = useMemo(
    () => [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Client", dataIndex: "clientName", key: "clientName", render: (v) => v ?? "—" },
      {
        title: "Stage",
        dataIndex: "stage",
        key: "stage",
        render: (v, r) => <Tag color={stageColor(v)}>{r.stageName ?? String(v)}</Tag>,
      },
      {
        title: "Value",
        dataIndex: "estimatedValue",
        key: "estimatedValue",
        render: (v, r) => `${r.currency?.toUpperCase() === "ZAR" ? "R" : ""}${Number(v || 0).toLocaleString()}`,
      },
      {
        title: "",
        key: "actions",
        render: (_, r) =>
          canDelete() ? (
            <Flex justify="flex-end">
              <Popconfirm
                title="Delete this opportunity?"
                okText="Delete"
                cancelText="Cancel"
                onConfirm={() => deleteOpportunity(r.id)}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Flex>
          ) : null,
      },
    ],
    [deleteOpportunity]
  );

  return (
    <Flex vertical className={styles.page} gap={16}>
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>
          Opportunities
        </Title>
        <Button className={styles.primaryBtn}>Add Opportunity</Button>
      </Flex>

      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => setTab(k as "all" | "mine")}
          items={[
            {
              key: "all",
              label: "All Opportunities",
              children: (
                <Table
                  rowKey={(r) => r.id}
                  columns={columns}
                  dataSource={data?.items ?? []}
                  loading={state.isPending}
                  pagination={{
                    current: data?.pageNumber ?? 1,
                    pageSize: data?.pageSize ?? 10,
                    total: data?.totalCount ?? 0,
                    showSizeChanger: true,
                    onChange: (page, pageSize) =>
                      tab === "all"
                        ? getOpportunities({ pageNumber: page, pageSize })
                        : getMyOpportunities({ pageNumber: page, pageSize }),
                  }}
                />
              ),
            },
            {
              key: "mine",
              label: "My Opportunities",
              children: (
                <Table
                  rowKey={(r) => r.id}
                  columns={columns}
                  dataSource={data?.items ?? []}
                  loading={state.isPending}
                  pagination={{
                    current: data?.pageNumber ?? 1,
                    pageSize: data?.pageSize ?? 10,
                    total: data?.totalCount ?? 0,
                    showSizeChanger: true,
                    onChange: (page, pageSize) =>
                      tab === "all"
                        ? getOpportunities({ pageNumber: page, pageSize })
                        : getMyOpportunities({ pageNumber: page, pageSize }),
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </Flex>
  );
};

export default OpportunitiesPage;