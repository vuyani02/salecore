"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Pagination,
  Popconfirm, Row, Select, Tabs, Tag, Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useOpportunitiesActions, useOpportunitiesState } from "@/providers/opportunitiesProvider";
import { useOpportunitiesPageStyles } from "./styeles/OpportunitiesStyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { Opportunity, CreateOpportunityPayload } from "@/types/opportunities";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Helpers ───────────────────────────────────────────────────────────────────
const stageColor = (stage: number) => {
  const map: Record<number, string> = {
    1: "purple",
    2: "blue",
    3: "gold",
    4: "cyan",
    5: "green",
    6: "red",
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
  { value: 1, label: "Lead" },
  { value: 2, label: "Qualified" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Negotiation" },
  { value: 5, label: "Closed Won" },
  { value: 6, label: "Closed Lost" },
];

const SOURCES = [
  { value: 1, label: "Website" },
  { value: 2, label: "Referral" },
  { value: 3, label: "Direct" },
  { value: 4, label: "Partner" },
  { value: 5, label: "Cold Call" },
  { value: 6, label: "Other" },
];

type TabKey = "all" | "mine";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ClientOption {
  id: string;
  name: string;
}

interface ContactOption {
  id: string;
  firstName: string;
  lastName: string;
}

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOpportunityPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const instance = getAxiosInstance();

  // Fetch clients on modal open
  useEffect(() => {
    if (!open) return;
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const res = await instance.get("/api/clients", {
          params: { pageNumber: 1, pageSize: 100 },
        });
        setClients(res.data?.items ?? []);
      } catch {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [open]);

  // Fetch contacts when client is selected
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
    onSubmit({
      ...values,
      expectedCloseDate: values.expectedCloseDate.format("YYYY-MM-DD"),
    });
    form.resetFields();
  };

  return (
    <Modal
      title="Add Opportunity"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="e.g. Annual SLA Deal" />
        </Form.Item>

        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: "Client is required" }]}
        >
          <Select
            showSearch
            placeholder="Select a client"
            loading={loadingClients}
            optionFilterProp="children"
            onChange={handleClientChange}
          >
            {clients.map((c) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="contactId" label="Contact (optional)">
          <Select
            showSearch
            placeholder="Select a contact"
            loading={loadingContacts}
            optionFilterProp="children"
            allowClear
          >
            {contacts.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </Option>
            ))}
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
                {STAGES.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="source" label="Source" initialValue={1}>
              <Select>
                {SOURCES.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}</Option>
                ))}
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
            <Form.Item
              name="expectedCloseDate"
              label="Expected Close Date"
              rules={[{ required: true, message: "Close date is required" }]}
            >
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
            <Button type="primary" htmlType="submit" loading={isPending}>
              Create
            </Button>
          </Flex>
        </Form.Item>

      </Form>
    </Modal>
  );
};

// ── Table helpers ─────────────────────────────────────────────────────────────
const cell = (content: React.ReactNode, width?: number) => (
  <Flex
    align="center"
    style={{
      width: width ? `${width}px` : "auto",
      flex: width ? "0 0 auto" : "1 1 0",
      minWidth: 0,
    }}
  >
    {content}
  </Flex>
);

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
  const current    = data?.pageNumber ?? pageNumber;
  const size       = data?.pageSize ?? pageSize;

  const onPageChange = (p: number, ps: number) => {
    setPageNumber(p);
    setPageSize(ps);
  };

  const handleCreate = async (payload: CreateOpportunityPayload) => {
    await createOpportunity(payload);
    setShowModal(false);
    getOpportunities({ pageNumber, pageSize });
  };

  const handleDelete = async (id: string) => {
    await deleteOpportunity(id);
    getOpportunities({ pageNumber, pageSize });
  };

  const TableHeader = () => (
    <Flex align="center" justify="space-between" className={styles.tableHeader}>
      {[
        { label: "Title"  },
        { label: "Client" },
        { label: "Stage",  width: 140 },
        { label: "Value",  width: 160 },
        { label: "",       width: 120 },
      ].map(({ label, width }) => (
        <Flex
          key={label}
          style={{ width: width ? `${width}px` : "auto", flex: width ? "0 0 auto" : "1 1 0" }}
        >
          <Text className={styles.headerCell}>{label}</Text>
        </Flex>
      ))}
    </Flex>
  );

  const TableRow = ({ row }: { row: Opportunity }) => (
    <Flex align="center" justify="space-between" className={styles.tableRow}>
      {cell(
        <Text className={styles.cellPrimary} ellipsis>{row.title}</Text>
      )}
      {cell(
        <Text className={styles.cellMuted} ellipsis>{row.clientName ?? "—"}</Text>
      )}
      {cell(
        <Tag color={stageColor(row.stage)} style={{ marginInlineEnd: 0 }}>
          {row.stageName ?? String(row.stage)}
        </Tag>,
        140
      )}
      {cell(
        <Text className={styles.cellPrimary}>
          {formatValue(row.estimatedValue, row.currency)}
        </Text>,
        160
      )}
      {cell(
        canDelete() ? (
          <Flex justify="flex-end" style={{ width: "100%" }}>
            <Popconfirm
              title="Delete this opportunity?"
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(row.id)}
            >
              <Button danger size="small">Delete</Button>
            </Popconfirm>
          </Flex>
        ) : null,
        120
      )}
    </Flex>
  );

  const TableBody = () => (
    <Flex vertical>
      <TableHeader />
      <Flex vertical>
        {items.length === 0 ? (
          <Flex justify="center" className={styles.emptyText}>
            <Text className={styles.cellMuted}>
              {state.isPending ? "Loading..." : "No opportunities found"}
            </Text>
          </Flex>
        ) : (
          items.map((row) => <TableRow key={row.id} row={row} />)
        )}
      </Flex>
      <Flex justify="space-between" align="center" className={styles.tableFooter}>
        <Text className={styles.showingText}>
          Showing {items.length} of {totalCount}
        </Text>
        <Pagination
          current={current}
          pageSize={size}
          total={totalCount}
          showSizeChanger
          onChange={onPageChange}
          onShowSizeChange={onPageChange}
        />
      </Flex>
    </Flex>
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
          onChange={(k) => {
            setTab(k as TabKey);
            setPageNumber(1);
          }}
          items={[
            { key: "all",  label: "All Opportunities",  children: <TableBody /> },
            { key: "mine", label: "My Opportunities",    children: <TableBody /> },
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