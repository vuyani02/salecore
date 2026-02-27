"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Popconfirm,
  Row, Select, Table, Tag, Tabs, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useOpportunitiesActions, useOpportunitiesState } from "@/providers/opportunitiesProvider";
import { useOpportunitiesPageStyles } from "./styeles/OpportunitiesStyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { Opportunity, CreateOpportunityPayload } from "@/types/opportunities";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Helpers ───────────────────────────────────────────────────────────────────
const stageColor = (stage: number) => {
  const map: Record<number, string> = {
    1: "purple", 2: "blue", 3: "gold",
    4: "cyan",   5: "green", 6: "red",
  };
  return map[stage] ?? "default";
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

const formatValue = (value?: number | null, currency?: string | null) => {
  const v = Number(value ?? 0);
  const isZar = (currency ?? "").toUpperCase() === "ZAR";
  return `${isZar ? "R" : ""}${v.toLocaleString()}`;
};

const STAGES = [
  { value: 1, label: "Lead"        },
  { value: 2, label: "Qualified"   },
  { value: 3, label: "Proposal"    },
  { value: 4, label: "Negotiation" },
  { value: 5, label: "Closed Won"  },
  { value: 6, label: "Closed Lost" },
];

const SOURCES = [
  { value: 1, label: "Website"   },
  { value: 2, label: "Referral"  },
  { value: 3, label: "Direct"    },
  { value: 4, label: "Partner"   },
  { value: 5, label: "Cold Call" },
  { value: 6, label: "Other"     },
];

type TabKey = "all" | "mine";

interface ClientOption  { id: string; name: string; }
interface ContactOption { id: string; firstName: string; lastName: string; }

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOpportunityPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form] = Form.useForm();
  const [clients,  setClients]  = useState<ClientOption[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loadingClients,  setLoadingClients]  = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const res = await instance.get("/api/clients", { params: { pageNumber: 1, pageSize: 100 } });
        setClients(res.data?.items ?? []);
      } catch {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [open]);

  const handleClientChange = async (clientId: string) => {
    form.setFieldValue("contactId", undefined);
    setContacts([]);
    if (!clientId) return;
    setLoadingContacts(true);
    try {
      const res = await instance.get(`/api/contacts/by-client/${clientId}`);
      setContacts(res.data ?? []);
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleFinish = (values: any) => {
    onSubmit({ ...values, expectedCloseDate: values.expectedCloseDate.format("YYYY-MM-DD") });
    form.resetFields();
  };

  return (
    <Modal title="Add Opportunity" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Annual SLA Deal" />
        </Form.Item>

        <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Client is required" }]}>
          <Select showSearch placeholder="Select a client" loading={loadingClients} optionFilterProp="children" onChange={handleClientChange}>
            {clients.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="contactId" label="Contact (optional)">
          <Select showSearch placeholder="Select a contact" loading={loadingContacts} optionFilterProp="children" allowClear>
            {contacts.map((c) => <Option key={c.id} value={c.id}>{c.firstName} {c.lastName}</Option>)}
          </Select>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="estimatedValue" label="Estimated Value" initialValue={0}>
              <InputNumber style={{ width: "100%" }} min={0} prefix="R" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="currency" label="Currency" initialValue="ZAR">
              <Select>
                <Option value="ZAR">ZAR</Option>
                <Option value="USD">USD</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="stage" label="Stage" initialValue={1}>
              <Select>
                {STAGES.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="source" label="Source" initialValue={1}>
              <Select>
                {SOURCES.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="probability" label="Probability (%)" initialValue={30}>
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="expectedCloseDate" label="Expected Close Date" rules={[{ required: true, message: "Close date is required" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional notes..." />
        </Form.Item>

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
const OpportunitiesPage = () => {
  const { styles } = useOpportunitiesPageStyles();
  const state = useOpportunitiesState();
  const { getOpportunities, getMyOpportunities, createOpportunity, deleteOpportunity } =
    useOpportunitiesActions();

  const [tab, setTab]               = useState<TabKey>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => {
    getOpportunities({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    if (tab === "all")  getOpportunities({ pageNumber, pageSize });
    if (tab === "mine") getMyOpportunities({ pageNumber, pageSize });
  }, [tab, pageNumber, pageSize]);

  const data       = tab === "all" ? state.opportunities : state.myOpportunities;
  const items      = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  const handleCreate = async (payload: CreateOpportunityPayload) => {
    await createOpportunity(payload);
    setShowModal(false);
    getOpportunities({ pageNumber, pageSize });
  };

  const handleDelete = async (id: string) => {
    await deleteOpportunity(id);
    if (tab === "all")  getOpportunities({ pageNumber, pageSize });
    if (tab === "mine") getMyOpportunities({ pageNumber, pageSize });
  };

  const columns: ColumnsType<Opportunity> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.clientName ?? "—"}</Text>
        </Flex>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      width: 140,
      render: (stage: number, record) => (
        <Tag color={stageColor(stage)} style={{ marginInlineEnd: 0 }}>
          {record.stageName ?? String(stage)}
        </Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      width: 130,
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{formatValue(v, record.currency)}</Text>
      ),
    },
    {
      title: "Probability",
      dataIndex: "probability",
      width: 110,
      render: (v: number) => <Text className={styles.cellMuted}>{v}%</Text>,
    },
    {
      title: "Close Date",
      dataIndex: "expectedCloseDate",
      width: 130,
      render: (d: string) => (
        <Text className={styles.cellMuted}>
          {d ? dayjs(d).format("DD MMM YYYY") : "—"}
        </Text>
      ),
    },
    ...(canDelete()
      ? [{
          title: "",
          key: "actions",
          width: 100,
          render: (_: unknown, record: Opportunity) => (
            <Flex justify="flex-end">
              <Popconfirm
                title="Delete this opportunity?"
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger size="small">Delete</Button>
              </Popconfirm>
            </Flex>
          ),
        }]
      : []),
  ];

  const TableContent = () => (
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
        showTotal: (total) => `${total} opportunities`,
        onChange: (p, ps) => {
          setPageNumber(p);
          setPageSize(ps);
        },
      }}
      locale={{ emptyText: "No opportunities found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Opportunities</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          Add Opportunity
        </Button>
      </Flex>

      {/* Table Card */}
      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => { setTab(k as TabKey); setPageNumber(1); }}
          items={[
            { key: "all",  label: "All Opportunities", children: <TableContent /> },
            { key: "mine", label: "My Opportunities",  children: <TableContent /> },
          ]}
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

export default OpportunitiesPage;