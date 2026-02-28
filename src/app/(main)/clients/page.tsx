"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Flex, Form, Input,
  Modal, Select, Table,
  Tag, Tooltip, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useClientsPageStyles } from "./styeles/clientsStyles";
import type { Client, CreateClientPayload } from "@/providers/clientsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;

const CLIENT_TYPES: Record<number, { label: string; color: string }> = {
  1: { label: "Prospect", color: "blue"    },
  2: { label: "Active",   color: "green"   },
  3: { label: "Inactive", color: "default" },
  4: { label: "Partner",  color: "purple"  },
};

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Retail",
  "Manufacturing", "Government", "Education", "Other",
];

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateClientPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: CreateClientPayload) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal title="Add Client" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item
          name="name"
          label="Client Name"
          rules={[{ required: true, message: "Client name is required" }]}
        >
          <Input placeholder="e.g. Acme Corp" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item name="industry" label="Industry" style={{ flex: 1 }}>
            <Select placeholder="Select industry" allowClear>
              {INDUSTRIES.map((i) => <Option key={i} value={i}>{i}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="clientType" label="Client Type" initialValue={1} style={{ flex: 1 }}>
            <Select>
              {Object.entries(CLIENT_TYPES).map(([k, v]) => (
                <Option key={k} value={Number(k)}>{v.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="billingAddress" label="Billing Address">
          <Input placeholder="123 Main St" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item name="taxNumber" label="Tax Number" style={{ flex: 1 }}>
            <Input placeholder="1234567890" />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size" style={{ flex: 1 }}>
            <Select placeholder="Select size" allowClear>
              {["1-10", "11-50", "50-100", "100-500", "500+"].map((s) => (
                <Option key={s} value={s}>{s}</Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item style={{ marginBottom: 0 }}>
          <Flex justify="flex-end" gap={8}>
            <Button className="styled-btn" onClick={onClose}>Cancel</Button>
            <Button className="styled-btn" htmlType="submit" loading={isPending}>Create</Button>
          </Flex>
        </Form.Item>

      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ClientsPage = () => {
  const { styles } = useClientsPageStyles();
  const state = useClientsState();
  const { getClients, createClient } = useClientsActions();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => {
    getClients({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    getClients({ pageNumber, pageSize });
  }, [pageNumber, pageSize]);

  const items      = useMemo(() => state.clients?.items ?? [], [state.clients]);
  const totalCount = state.clients?.totalCount ?? 0;

  const handleCreate = async (payload: CreateClientPayload) => {
    await createClient(payload);
    setShowModal(false);
    getClients({ pageNumber, pageSize });
  };

  const columns: ColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => (
        <Text className={styles.cellPrimary}>{name}</Text>
      ),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      render: (industry: string) => (
        <Text className={styles.cellMuted}>{industry ?? "—"}</Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "clientType",
      width: 120,
      render: (type: number) => {
        const t = CLIENT_TYPES[type];
        return t
          ? <Tag color={t.color} style={{ marginInlineEnd: 0 }}>{t.label}</Tag>
          : <Text className={styles.cellMuted}>—</Text>;
      },
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (website: string) =>
        website ? (
          <Tooltip title={website} placement="topLeft">
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {website}
            </a>
          </Tooltip>
        ) : (
          <Text className={styles.cellMuted}>—</Text>
        ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Clients</Title>
        <Button
          icon={<PlusOutlined />}
          className={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          Add Client
        </Button>
      </Flex>

      {/* Table */}
      <Card className={styles.card} variant="outlined">
        <Table
          className={styles.table}
          dataSource={items}
          columns={columns}
          rowKey="id"
          loading={state.isPending}
          pagination={{
            current: pageNumber,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            showTotal: (total) => `${total} clients`,
            onChange: (p, ps) => {
              setPageNumber(p);
              setPageSize(ps);
            },
          }}
          locale={{ emptyText: "No clients found" }}
        />
      </Card>

      {/* Modal */}
      <CreateModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default ClientsPage;