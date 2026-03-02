"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Card, Col, DatePicker, Descriptions, Divider, Dropdown,
  Flex, Form, Input, InputNumber, Modal, Row, Select, Switch,
  Table, Tag, Tabs, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, CheckOutlined, StopOutlined, ReloadOutlined,
  DeleteOutlined, WarningOutlined, MoreOutlined, EditOutlined,
  EyeOutlined, SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useContractsState, useContractsActions } from "@/providers/contractsProvider";
import { useContractsPageStyles } from "./styeles/Contractsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { CreateContractPayload } from "@/providers/contractsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Full Contract shape from API ───────────────────────────────────────────────
interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName?: string;
  opportunityId?: string;
  opportunityTitle?: string;
  proposalId?: string;
  proposalNumber?: string;
  title: string;
  contractValue: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  status: number;
  statusName?: string;
  renewalNoticePeriod?: number;
  autoRenew: boolean;
  terms?: string;
  ownerId?: string;
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
  renewalsCount?: number;
}

interface CreateRenewalPayload {
  renewalOpportunityId?: string;
  notes?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Draft",     color: "default" },
  2: { label: "Active",    color: "green"   },
  3: { label: "Expired",   color: "red"     },
  4: { label: "Renewed",   color: "blue"    },
  5: { label: "Cancelled", color: "volcano" },
};

const STATUS_COLOR: Record<string, string> = {
  Draft: "default", Active: "green", Expired: "red", Renewed: "blue", Cancelled: "volcano",
};

const formatMoney = (value?: number, currency = "ZAR") => {
  if (value == null) return "—";
  const prefix = currency.toUpperCase() === "ZAR" ? "R" : "$";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${prefix}${Math.round(value / 1_000)}K`;
  return `${prefix}${value.toLocaleString()}`;
};

type TabKey = "all" | "active" | "expiring";
interface OpportunityOption { id: string; title: string; }

// ── Contract Modal (Create + Edit) ────────────────────────────────────────────
interface ContractModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateContractPayload) => void;
  isPending: boolean;
  initial?: Contract | null;
}

const ContractModal = ({ open, onClose, onSubmit, isPending, initial }: ContractModalProps) => {
  const [form]      = Form.useForm();
  const isEdit      = !!initial;
  const [opps,      setOpps]      = useState<any[]>([]);
  const [clients,   setClients]   = useState<any[]>([]);
  const [users,     setUsers]     = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      instance.get("/api/opportunities", { params: { pageNumber: 1, pageSize: 100 } }),
      instance.get("/api/clients",       { params: { pageNumber: 1, pageSize: 100 } }),
      instance.get("/api/users",         { params: { pageSize: 100, isActive: true } }),
      instance.get("/api/proposals",     { params: { pageNumber: 1, pageSize: 100, status: 3 } }),
    ])
      .then(([o, c, u, p]) => {
        setOpps(o.data?.items ?? []);
        setClients(c.data?.items ?? []);
        setUsers(u.data?.items ?? []);
        setProposals(p.data?.items ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    if (initial) {
      form.setFieldsValue({
        ...initial,
        startDate: initial.startDate ? dayjs(initial.startDate) : undefined,
        endDate:   initial.endDate   ? dayjs(initial.endDate)   : undefined,
      });
    } else {
      form.resetFields();
      const uid = localStorage.getItem("user_id");
      if (uid) form.setFieldValue("ownerId", uid);
    }
  }, [open, initial]);

  const handleFinish = (values: any) => {
    onSubmit({
      title:               values.title,
      clientId:            values.clientId      || undefined,
      opportunityId:       values.opportunityId || undefined,
      proposalId:          values.proposalId    || undefined,
      contractValue:       values.contractValue,
      currency:            values.currency,
      startDate:           values.startDate?.format("YYYY-MM-DD"),
      endDate:             values.endDate?.format("YYYY-MM-DD"),
      autoRenew:           values.autoRenew,
      renewalNoticePeriod: values.renewalNoticePeriod,
      ownerId:             values.ownerId        || undefined,
      terms:               values.terms          || undefined,
    });
    form.resetFields();
  };

  return (
    <Modal title={isEdit ? "Edit Contract" : "Create Contract"} open={open} onCancel={onClose} footer={null} destroyOnHidden width={580}>
      <Form form={form} layout="vertical" onFinish={handleFinish}
        initialValues={{ currency: "ZAR", autoRenew: false, renewalNoticePeriod: 30 }}
      >
        <Form.Item name="title" label="Contract Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Annual SLA — Acme Corp" />
        </Form.Item>

        <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Client is required" }]}>
          <Select showSearch placeholder="Select client" loading={loading} optionFilterProp="children">
            {clients.map((c: any) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="ownerId" label="Owner" rules={[{ required: true, message: "Owner is required" }]}>
              <Select showSearch placeholder="Select owner" loading={loading} optionFilterProp="children">
                {users.map((u: any) => (
                  <Option key={u.id} value={u.id}>{u.fullName ?? `${u.firstName} ${u.lastName}`}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="opportunityId" label="Linked Opportunity">
              <Select showSearch placeholder="Optional" loading={loading} optionFilterProp="children" allowClear>
                {opps.map((o: any) => <Option key={o.id} value={o.id}>{o.title}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="proposalId" label="Linked Proposal"
          extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>The approved proposal this contract is based on</Text>}
        >
          <Select showSearch placeholder="Optional" loading={loading} optionFilterProp="children" allowClear>
            {proposals.map((p: any) => <Option key={p.id} value={p.id}>{p.title}</Option>)}
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
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: "Required" }]}>
              <DatePicker style={{ width: "100%" }} placeholder="Select start date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: "Required" }]}>
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
            <Form.Item name="renewalNoticePeriod" label="Renewal Notice (days)"
              extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>Days before expiry to send notice</Text>}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={365} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="terms" label="Terms">
          <TextArea rows={3} placeholder="Optional contract terms..." />
        </Form.Item>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            {isEdit ? "Save Changes" : "Save as Draft"}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ contract, open, onClose }: { contract: Contract | null; open: boolean; onClose: () => void }) => {
  if (!contract) return null;
  const label = contract.statusName ?? STATUS[contract.status]?.label;
  const color = label ? (STATUS_COLOR[label] ?? "default") : "default";
  const isNear = !!(contract.endDate &&
    dayjs(contract.endDate).diff(dayjs(), "day") <= 30 &&
    dayjs(contract.endDate).isAfter(dayjs()));

  return (
    <Modal
      open={open} onCancel={onClose}
      footer={<Flex justify="flex-end"><Button onClick={onClose}>Close</Button></Flex>}
      destroyOnHidden width={620}
      title={
        <Flex vertical gap={6}>
          <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 700 }}>{contract.title}</Text>
          <Flex gap={6} wrap="wrap">
            {label && <Tag color={color} style={{ marginInlineEnd: 0 }}>{label}</Tag>}
            {contract.currency && <Tag style={{ marginInlineEnd: 0 }}>{contract.currency}</Tag>}
            {isNear && <Tag color="orange" icon={<WarningOutlined />} style={{ marginInlineEnd: 0 }}>Expiring Soon</Tag>}
          </Flex>
        </Flex>
      }
    >
      <Descriptions column={2} size="small" style={{ marginBottom: 16 }}
        labelStyle={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}
        contentStyle={{ color: "rgba(0,0,0,0.85)", fontSize: 13, fontWeight: 600 }}
      >
        <Descriptions.Item label="Client">{contract.clientName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Opportunity">{contract.opportunityTitle ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Contract Value">{formatMoney(contract.contractValue, contract.currency)}</Descriptions.Item>
        <Descriptions.Item label="Auto Renew">{contract.autoRenew ? "Yes" : "No"}</Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {contract.startDate ? dayjs(contract.startDate).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          <Flex align="center" gap={6}>
            {isNear && <WarningOutlined style={{ color: "#f97316" }} />}
            <span style={{ color: isNear ? "#f97316" : undefined }}>
              {contract.endDate ? dayjs(contract.endDate).format("DD MMM YYYY") : "—"}
            </span>
          </Flex>
        </Descriptions.Item>
        <Descriptions.Item label="Renewal Notice">
          {contract.renewalNoticePeriod ? `${contract.renewalNoticePeriod} days` : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Owner">{contract.ownerName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {contract.createdAt ? dayjs(contract.createdAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
      </Descriptions>

      {contract.terms && (
        <>
          <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "8px 0 12px" }} />
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Terms
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.75)", fontSize: 13 }}>{contract.terms}</Text>
        </>
      )}
    </Modal>
  );
};

// ── Renewal Modal ─────────────────────────────────────────────────────────────
interface RenewalSubmitPayload {
  renewalOpportunityId?: string;
  notes?: string;
  newStartDate: string;
  newEndDate: string;
}

const RenewalModal = ({ open, onClose, onSubmit, isPending, contract }: {
  open: boolean; onClose: () => void; onSubmit: (p: RenewalSubmitPayload) => void;
  isPending: boolean; contract: Contract | null;
}) => {
  const [form]    = Form.useForm();
  const [opps,    setOpps]    = useState<OpportunityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) { form.resetFields(); return; }
    setLoading(true);
    instance.get("/api/opportunities", { params: { pageNumber: 1, pageSize: 100 } })
      .then((r) => setOpps(r.data?.items ?? []))
      .catch(() => setOpps([]))
      .finally(() => setLoading(false));
    // Pre-fill new start as day after current end
    if (contract?.endDate) {
      form.setFieldValue("newStartDate", dayjs(contract.endDate).add(1, "day"));
    }
  }, [open]);

  const handleFinish = (values: any) => {
    onSubmit({
      renewalOpportunityId: values.renewalOpportunityId || undefined,
      notes:                values.notes?.trim()        || undefined,
      newStartDate:         values.newStartDate.format("YYYY-MM-DD"),
      newEndDate:           values.newEndDate.format("YYYY-MM-DD"),
    });
  };

  return (
    <Modal title="Create Renewal" open={open} onCancel={onClose} footer={null} destroyOnHidden width={520}>
      {contract && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(0,0,0,0.03)", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Flex vertical gap={4}>
            <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Renewing contract</Text>
            <Text style={{ color: "rgba(0,0,0,0.85)", fontWeight: 600, fontSize: 13 }}>{contract.title}</Text>
            <Flex gap={12}>
              {contract.endDate && (
                <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                  Current end: <strong style={{ color: "rgba(0,0,0,0.7)" }}>{dayjs(contract.endDate).format("DD MMM YYYY")}</strong>
                </Text>
              )}
              {contract.contractValue != null && (
                <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                  Value: <strong style={{ color: "rgba(0,0,0,0.7)" }}>{formatMoney(contract.contractValue, contract.currency)}</strong>
                </Text>
              )}
            </Flex>
          </Flex>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* New dates — collected upfront so we can update contract before status changes */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="newStartDate" label="New Start Date" rules={[{ required: true, message: "Required" }]}>
              <DatePicker style={{ width: "100%" }} placeholder="Select new start" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="newEndDate"
              label="New End Date"
              rules={[
                { required: true, message: "Required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("newStartDate");
                    if (!value || !start || value.isAfter(start)) return Promise.resolve();
                    return Promise.reject(new Error("Must be after start date"));
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="Select new end" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="renewalOpportunityId" label="Link to Opportunity"
          extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>Optional — link to an opportunity tracking this renewal</Text>}
        >
          <Select showSearch allowClear placeholder="Select opportunity (optional)" loading={loading} optionFilterProp="children">
            {opps.map((o) => <Option key={o.id} value={o.id}>{o.title}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <TextArea rows={2} placeholder="e.g. Annual CPI adjustment of 8%" />
        </Form.Item>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Create Renewal
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Complete Renewal Modal ────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────
const ContractsPage = () => {
  const { styles } = useContractsPageStyles();
  const state      = useContractsState();
  const {
    getContracts, getExpiringContracts,
    createContract, updateContract, activateContract, cancelContract,
    createRenewal, deleteContract,
  } = useContractsActions();
  const instance = getAxiosInstance();

  // ── Role check ────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const canManage = mounted && ["Admin", "SalesManager"].includes(localStorage.getItem("user_role") ?? "");

  // ── State ─────────────────────────────────────────────────────────────────
  const [tab,          setTab]          = useState<TabKey>("all");
  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(4);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [searchTerm,   setSearchTerm]   = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showCreate,            setShowCreate]            = useState(false);
  const [editTarget,            setEditTarget]            = useState<Contract | null>(null);
  const [viewTarget,            setViewTarget]            = useState<Contract | null>(null);
  const [showRenewal,           setShowRenewal]           = useState(false);
  const [renewalTarget,         setRenewalTarget]         = useState<Contract | null>(null);
  const [activateTarget,        setActivateTarget]        = useState<string | null>(null);
  const [cancelTarget,          setCancelTarget]          = useState<string | null>(null);
  const [deleteTarget,          setDeleteTarget]          = useState<string | null>(null);

  // ── Data loading ──────────────────────────────────────────────────────────
  const load = () => {
    if (tab === "expiring") { getExpiringContracts(30); return; }
    getContracts({ pageNumber, pageSize, status: tab === "active" ? 2 : statusFilter });
  };

  useEffect(() => { getContracts({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { load(); }, [tab, pageNumber, pageSize, statusFilter]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      if (tab !== "expiring") {
        getContracts({ pageNumber: 1, pageSize, status: tab === "active" ? 2 : statusFilter, searchTerm: val || undefined });
      }
    }, 400);
  };

  const data       = useMemo(() => tab === "expiring" ? state.expiringContracts : state.contracts, [tab, state]);
  const items      = useMemo(() => (data?.items ?? []) as Contract[], [data]);
  const totalCount = data?.totalCount ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate   = async (p: CreateContractPayload) => { await createContract(p);                              setShowCreate(false);    load(); };
  const handleEdit     = async (p: CreateContractPayload) => { if (!editTarget)    return; await updateContract(editTarget.id, p);    setEditTarget(null);    load(); };
  const handleActivate = async ()                          => { if (!activateTarget) return; await activateContract(activateTarget);  setActivateTarget(null); load(); };
  const handleCancel   = async ()                          => { if (!cancelTarget)  return; await cancelContract(cancelTarget);       setCancelTarget(null);  load(); };
  const handleDelete   = async ()                          => { if (!deleteTarget)  return; await deleteContract(deleteTarget);       setDeleteTarget(null);  load(); };

  const handleRenewal = async (p: RenewalSubmitPayload) => {
    if (!renewalTarget) return;
    const c = renewalTarget;
    try {
      // Step 1 — update contract dates while still Active
      await instance.put(`/api/contracts/${c.id}`, {
        title:               c.title,
        clientId:            c.clientId,
        opportunityId:       c.opportunityId       ?? undefined,
        proposalId:          c.proposalId          ?? undefined,
        contractValue:       c.contractValue,
        currency:            c.currency,
        startDate:           p.newStartDate,
        endDate:             p.newEndDate,
        autoRenew:           c.autoRenew,
        renewalNoticePeriod: c.renewalNoticePeriod ?? undefined,
        ownerId:             c.ownerId             ?? undefined,
        terms:               c.terms               ?? undefined,
      });

      // Step 2 — create the renewal record (status: Pending)
      const renewalRes = await instance.post(`/api/contracts/${c.id}/renewals`, {
        renewalOpportunityId: p.renewalOpportunityId,
        notes:                p.notes,
      });
      const renewalId = renewalRes.data?.id;

      // Step 3 — complete the renewal (status: Renewed)
      if (renewalId) {
        await instance.put(`/api/contracts/renewals/${renewalId}/complete`);
      }

      setShowRenewal(false);
      setRenewalTarget(null);
      load();
    } catch {
      // provider surfaces error toast; modal stays open to retry
    }
  };


  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: ColumnsType<Contract> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          {record.clientName && <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.clientName}</Text>}
        </Flex>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number, record: Contract) => {
        const label = record.statusName ?? STATUS[status]?.label;
        const color = label ? (STATUS_COLOR[label] ?? "default") : "default";
        return <Tag color={color} style={{ marginInlineEnd: 0 }}>{label ?? `Status ${status}`}</Tag>;
      },
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      render: (v: number, record) => <Text className={styles.cellPrimary}>{formatMoney(v, record.currency)}</Text>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (d?: string) => <Text className={styles.cellMuted}>{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>,
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
      render: (v?: boolean) => <Tag color={v ? "green" : "default"} style={{ marginInlineEnd: 0 }}>{v ? "Yes" : "No"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_: unknown, record: Contract) => {
        const menuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => setViewTarget(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => setEditTarget(record),
          },

          // Activate — Draft only
          ...(record.status === 1 ? [
            { type: "divider" as const },
            {
              key: "activate",
              label: "Activate",
              icon: <CheckOutlined />,
              onClick: () => setActivateTarget(record.id),
            },
          ] : []),

          // Active-only actions
          ...(record.status === 2 ? [
            { type: "divider" as const },
            {
              key: "renew",
              label: "Create Renewal",
              icon: <ReloadOutlined />,
              onClick: () => { setRenewalTarget(record); setShowRenewal(true); },
            },
          ] : []),

          // Cancel — Draft or Active, managers only
          ...((record.status === 1 || record.status === 2) && canManage ? [
            { type: "divider" as const },
            {
              key: "cancel",
              label: "Cancel Contract",
              icon: <StopOutlined />,
              danger: true,
              onClick: () => setCancelTarget(record.id),
            },
          ] : []),

          // Delete — Draft only, managers only
          ...(record.status === 1 && canManage ? [
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => setDeleteTarget(record.id),
            },
          ] : []),
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
            <Button
              size="small"
              icon={<MoreOutlined />}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(112,112,112,0.3)",
                color: "rgba(255,255,255,0.7)",
                boxShadow: "none",
              }}
            />
          </Dropdown>
        );
      },
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
        tab === "expiring" ? false : {
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

      {/* Filters */}
      {tab !== "expiring" && mounted && (
        <Flex gap={12} wrap="wrap">
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
            style={{ width: 220, backgroundColor: "#707070", border: "none", color: "#fff" }}
          />
          {tab === "all" && (
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
          )}
        </Flex>
      )}

      {/* Table */}
      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => {
            setTab(k as TabKey);
            setPageNumber(1);
            setStatusFilter(undefined);
            setSearchTerm("");
          }}
          items={[
            { key: "all",      label: "All Contracts",      children: <TableContent /> },
            { key: "active",   label: "Active",             children: <TableContent /> },
            { key: "expiring", label: "Expiring (30 days)", children: <TableContent /> },
          ]}
        />
      </Card>

      {/* Create */}
      <ContractModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} isPending={state.isPending} />

      {/* Edit */}
      <ContractModal open={!!editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEdit} isPending={state.isPending} initial={editTarget} />

      {/* View */}
      <ViewModal contract={viewTarget} open={!!viewTarget} onClose={() => setViewTarget(null)} />

      {/* Create Renewal */}
      <RenewalModal
        open={showRenewal}
        onClose={() => { setShowRenewal(false); setRenewalTarget(null); }}
        onSubmit={handleRenewal}
        isPending={state.isPending}
        contract={renewalTarget}
      />

      {/* Activate */}
      <Modal open={!!activateTarget} onCancel={() => setActivateTarget(null)} onOk={handleActivate}
        okText="Activate" title="Activate Contract" width={420}
        okButtonProps={{ style: { backgroundColor: "#1a7a3a", border: "none", boxShadow: "none" }, loading: state.isPending }}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Activating this contract will make it live. You can cancel it afterwards if needed.
        </Text>
      </Modal>

      {/* Cancel */}
      <Modal open={!!cancelTarget} onCancel={() => setCancelTarget(null)} onOk={handleCancel}
        okText="Cancel Contract" title="Cancel Contract" width={420}
        okButtonProps={{ danger: true, loading: state.isPending }}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to cancel this contract? This action cannot be undone.
        </Text>
      </Modal>

      {/* Delete */}
      <Modal open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onOk={handleDelete}
        okText="Delete" title="Delete Contract" width={420}
        okButtonProps={{ danger: true, loading: state.isPending }}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to permanently delete this draft? This cannot be undone.
        </Text>
      </Modal>

    </Flex>
  );
};

export default ContractsPage;