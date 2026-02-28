"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Popconfirm,
  Row, Select, Switch, Table, Tag, Tabs, Tooltip, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, CheckOutlined, StopOutlined,
  ReloadOutlined, DeleteOutlined, WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useContractsState, useContractsActions } from "@/providers/contractsProvider";
import { useContractsPageStyles } from "./styeles/Contractsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type {
  Contract,
  CreateContractPayload,
  CreateRenewalPayload,
} from "@/providers/contractsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Constants ─────────────────────────────────────────────────────────────────
// ContractStatus: 1=Draft, 2=Active, 3=Expired, 4=Renewed, 5=Cancelled

const STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Draft",     color: "default" },
  2: { label: "Active",    color: "green"   },
  3: { label: "Expired",   color: "red"     },
  4: { label: "Renewed",   color: "blue"    },
  5: { label: "Cancelled", color: "volcano" },
};

const formatMoney = (value?: number, currency = "ZAR") => {
  if (!value && value !== 0) return "—";
  const prefix = currency.toUpperCase() === "ZAR" ? "R" : "$";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${prefix}${Math.round(value / 1_000)}K`;
  return `${prefix}${value.toLocaleString()}`;
};

const canManage = () => {
  try {
    const roles = JSON.parse(localStorage.getItem("roles") ?? "[]") as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch { return false; }
};

interface OpportunityOption { id: string; title: string; }
type TabKey = "all" | "active" | "expiring";

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateContractPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form]          = Form.useForm();
  const [opportunities, setOpportunities] = useState<OpportunityOption[]>([]);
  const [loadingOpp,    setLoadingOpp]    = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoadingOpp(true);
    instance.get("/api/opportunities", { params: { pageNumber: 1, pageSize: 100 } })
      .then((r) => setOpportunities(r.data?.items ?? []))
      .catch(() => setOpportunities([]))
      .finally(() => setLoadingOpp(false));
  }, [open]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      startDate: values.startDate?.toISOString(),
      endDate:   values.endDate?.toISOString(),
    });
    form.resetFields();
  };

  return (
    <Modal title="Create Contract" open={open} onCancel={onClose} footer={null} destroyOnHidden width={580}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ currency: "ZAR", autoRenew: false, renewalNoticePeriodDays: 30 }}>

        <Form.Item name="title" label="Contract Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Annual SLA — Acme Corp" />
        </Form.Item>

        <Form.Item
          name="opportunityId"
          label="Linked Opportunity"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Which won opportunity does this contract close?</Text>}
        >
          <Select showSearch placeholder="Select opportunity (optional)" loading={loadingOpp} optionFilterProp="children" allowClear>
            {opportunities.map((o) => <Option key={o.id} value={o.id}>{o.title}</Option>)}
          </Select>
        </Form.Item>

        <Row gutter={12}>
          <Col span={14}>
            <Form.Item name="contractValue" label="Contract Value" rules={[{ required: true, message: "Value is required" }]}>
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="currency" label="Currency">
              <Select>
                <Option value="ZAR">ZAR (R)</Option>
                <Option value="USD">USD ($)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: "Start date is required" }]}>
              <DatePicker style={{ width: "100%" }} placeholder="Select start date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: "End date is required" }]}>
              <DatePicker style={{ width: "100%" }} placeholder="Select end date" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12} align="middle">
          <Col span={12}>
            <Form.Item name="autoRenew" label="Auto Renew" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="renewalNoticePeriodDays"
              label="Renewal Notice (days)"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Days before expiry to send notice</Text>}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={365} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Optional contract notes..." />
        </Form.Item>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Save as Draft
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Renewal Modal ─────────────────────────────────────────────────────────────
interface RenewalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRenewalPayload) => void;
  isPending: boolean;
  currentEndDate?: string;
  currency?: string;
}

const RenewalModal = ({ open, onClose, onSubmit, isPending, currentEndDate, currency }: RenewalModalProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      newStartDate:      values.newStartDate?.toISOString(),
      newEndDate:        values.newEndDate?.toISOString(),
      newContractValue:  values.newContractValue,
      notes:             values.notes,
    });
    form.resetFields();
  };

  return (
    <Modal title="Create Renewal" open={open} onCancel={onClose} footer={null} destroyOnHidden width={480}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        {currentEndDate && (
          <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 6 }}>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
              Current contract ends: <strong style={{ color: "rgba(255,255,255,0.8)" }}>{dayjs(currentEndDate).format("DD MMM YYYY")}</strong>
            </Text>
          </div>
        )}

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="newStartDate" label="New Start Date">
              <DatePicker style={{ width: "100%" }} placeholder="Select start" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="newEndDate" label="New End Date">
              <DatePicker style={{ width: "100%" }} placeholder="Select end" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="newContractValue"
          label={`New Contract Value ${currency === "USD" ? "($)" : "(R)"}`}
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Leave blank to keep existing value</Text>}
        >
          <InputNumber style={{ width: "100%" }} min={0} placeholder="Optional new value" />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} placeholder="Any notes about this renewal..." />
        </Form.Item>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Create Renewal
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ContractsPage = () => {
  const { styles } = useContractsPageStyles();
  const state = useContractsState();
  const {
    getContracts, getExpiringContracts,
    createContract, activateContract, cancelContract,
    createRenewal, deleteContract,
  } = useContractsActions();

  const [tab,          setTab]          = useState<TabKey>("all");
  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [showCreate,   setShowCreate]   = useState(false);
  const [showRenewal,  setShowRenewal]  = useState(false);
  const [renewalTarget, setRenewalTarget] = useState<Contract | null>(null);

  const load = (t = tab, p = pageNumber, ps = pageSize) => {
    if (t === "expiring") { getExpiringContracts(30); return; }
    const query = { pageNumber: p, pageSize: ps, status: t === "active" ? 2 : statusFilter };
    getContracts(query);
  };

  useEffect(() => { getContracts({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { load(); }, [tab, pageNumber, pageSize, statusFilter]);

  const data = useMemo(() => {
    if (tab === "expiring") return state.expiringContracts;
    return state.contracts;
  }, [tab, state]);

  const items      = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  const handleCreate = async (payload: CreateContractPayload) => {
    await createContract(payload);
    setShowCreate(false);
    load();
  };

  const handleActivate = async (id: string) => {
    await activateContract(id);
    load();
  };

  const handleCancel = async (id: string) => {
    await cancelContract(id);
    load();
  };

  const handleRenewalClick = (record: Contract) => {
    setRenewalTarget(record);
    setShowRenewal(true);
  };

  const handleRenewal = async (payload: CreateRenewalPayload) => {
    if (!renewalTarget) return;
    await createRenewal(renewalTarget.id, payload);
    setShowRenewal(false);
    setRenewalTarget(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteContract(id);
    load();
  };

  const columns: ColumnsType<Contract> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          {record.clientName && (
            <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.clientName}</Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        const s = STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>—</Tag>;
      },
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{formatMoney(v, record.currency)}</Text>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (d?: string) => (
        <Text className={styles.cellMuted}>{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (d?: string) => {
        if (!d) return <Text className={styles.cellMuted}>—</Text>;
        const isNear = dayjs(d).diff(dayjs(), "day") <= 30 && dayjs(d).isAfter(dayjs());
        return (
          <Flex align="center" gap={4}>
            {isNear && <WarningOutlined style={{ color: "#f97316", fontSize: 12 }} />}
            <Text className={styles.cellMuted} style={isNear ? { color: "#f97316" } : undefined}>
              {dayjs(d).format("DD MMM YYYY")}
            </Text>
          </Flex>
        );
      },
    },
    {
      title: "Auto Renew",
      dataIndex: "autoRenew",
      render: (v?: boolean) => (
        <Text className={styles.cellMuted}>{v ? "Yes" : "No"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Contract) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          {/* Activate — Draft only */}
          {record.status === 1 && (
            <Popconfirm title="Activate this contract?" okText="Activate" cancelText="Cancel" onConfirm={() => handleActivate(record.id)}>
              <Button
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", boxShadow: "none" }}
              >
                Activate
              </Button>
            </Popconfirm>
          )}

          {/* Renew — Active only */}
          {record.status === 2 && (
            <Tooltip title="Create a renewal for this contract">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
                onClick={() => handleRenewalClick(record)}
              >
                Renew
              </Button>
            </Tooltip>
          )}

          {/* Cancel — Draft or Active, managers only */}
          {(record.status === 1 || record.status === 2) && canManage() && (
            <Popconfirm title="Cancel this contract?" okText="Cancel Contract" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => handleCancel(record.id)}>
              <Button
                size="small"
                icon={<StopOutlined />}
                danger
                style={{ boxShadow: "none" }}
              >
                Cancel
              </Button>
            </Popconfirm>
          )}

          {/* Delete — Draft only, managers only */}
          {record.status === 1 && canManage() && (
            <Popconfirm title="Permanently delete this contract?" okText="Delete" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} style={{ boxShadow: "none" }} />
            </Popconfirm>
          )}
        </Flex>
      ),
    },
  ];

  const TableContent = () => (
    <Table
      className={styles.table}
      dataSource={items}
      columns={columns}
      rowKey="id"
      loading={state.isPending}
      pagination={
        tab === "expiring"
          ? false
          : {
              current: pageNumber,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `${total} contracts`,
              onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
            }
      }
      locale={{ emptyText: "No contracts found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Contracts</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          New Contract
        </Button>
      </Flex>

      {/* Status filter — only on All tab */}
      {tab === "all" && (
        <Flex gap={12}>
          <Select
            className={styles.filterSelect}
            placeholder="All Statuses"
            allowClear
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPageNumber(1); }}
            style={{ minWidth: 150 }}
          >
            {Object.entries(STATUS).map(([k, v]) => (
              <Option key={k} value={Number(k)}>{v.label}</Option>
            ))}
          </Select>
        </Flex>
      )}

      {/* Table card */}
      <Card className={styles.card} variant="outlined" style={{ width: "100%" }}>
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => { setTab(k as TabKey); setPageNumber(1); setStatusFilter(undefined); }}
          items={[
            { key: "all",      label: "All Contracts",      children: <TableContent /> },
            { key: "active",   label: "Active",             children: <TableContent /> },
            { key: "expiring", label: "Expiring (30 days)", children: <TableContent /> },
          ]}
        />
      </Card>

      {/* Create Modal */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      {/* Renewal Modal */}
      <RenewalModal
        open={showRenewal}
        onClose={() => { setShowRenewal(false); setRenewalTarget(null); }}
        onSubmit={handleRenewal}
        isPending={state.isPending}
        currentEndDate={renewalTarget?.endDate}
        currency={renewalTarget?.currency}
      />

    </Flex>
  );
};

export default ContractsPage;