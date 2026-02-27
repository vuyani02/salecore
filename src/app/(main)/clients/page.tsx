"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, Flex, Form, Input,
  Modal, Popconfirm, Row, Select, Table,
  Tag, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useClientsPageStyles } from "./styeles/clientsStyles";
import type { Client, CreateClientPayload } from "@/providers/clientsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Helpers ───────────────────────────────────────────────────────────────────
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
    <Modal title="Add Client" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item
          name="name"
          label="Client Name"
          rules={[{ required: true, message: "Client name is required" }]}
        >
          <Input placeholder="e.g. Acme Corp" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="industry" label="Industry">
              <Select placeholder="Select industry" allowClear>
                {INDUSTRIES.map((i) => <Option key={i} value={i}>{i}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="clientType" label="Client Type" initialValue={1}>
              <Select>
                {Object.entries(CLIENT_TYPES).map(([k, v]) => (
                  <Option key={k} value={Number(k)}>{v.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="billingAddress" label="Billing Address">
          <Input placeholder="123 Main St" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="taxNumber" label="Tax Number">
              <Input placeholder="1234567890" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="companySize" label="Company Size">
              <Select placeholder="Select size" allowClear>
                {["1-10", "11-50", "50-100", "100-500", "500+"].map((s) => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <Flex justify="flex-end" gap={8}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>Create</Button>
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
  const { getClients, createClient, deleteClient } = useClientsActions();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState("");
  const [industry, setIndustry]     = useState<string | undefined>();

  useEffect(() => {
    getClients({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    getClients({ pageNumber, pageSize, searchTerm: search, industry });
  }, [pageNumber, pageSize, industry]);

  const items      = useMemo(() => state.clients?.items ?? [], [state.clients]);
  const totalCount = state.clients?.totalCount ?? 0;

  const handleSearch = () => {
    setPageNumber(1);
    getClients({ pageNumber: 1, pageSize, searchTerm: search, industry });
  };

  const handleCreate = async (payload: CreateClientPayload) => {
    await createClient(payload);
    setShowModal(false);
    getClients({ pageNumber, pageSize });
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
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
      width: 130,
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
      width: 220,
      render: (website: string) =>
        website ? (
          <a href={website} target="_blank" rel="noreferrer">
            <Text className={styles.cellMuted} ellipsis={{ tooltip: website }}>
              {website}
            </Text>
          </a>
        ) : (
          <Text className={styles.cellMuted}>—</Text>
        ),
    },
    ...(canDelete()
      ? [
          {
            title: "",
            key: "actions",
            width: 100,
            render: (_: unknown, record: Client) => (
              <Flex justify="flex-end">
                <Popconfirm
                  title="Delete this client?"
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger size="small">Delete</Button>
                </Popconfirm>
              </Flex>
            ),
          },
        ]
      : []),
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Clients</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          Add Client
        </Button>
      </Flex>

      {/* Search & Filters */}
      <Flex gap={12} wrap="wrap">
        <Input
          placeholder="Search clients..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          style={{ flex: 1, minWidth: 200, maxWidth: 360 }}
        />
        <Select
          placeholder="All Industries"
          allowClear
          value={industry}
          onChange={(v) => { setIndustry(v); setPageNumber(1); }}
          style={{ minWidth: 180 }}
        >
          {INDUSTRIES.map((i) => <Option key={i} value={i}>{i}</Option>)}
        </Select>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
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