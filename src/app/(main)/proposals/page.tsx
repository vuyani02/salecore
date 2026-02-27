"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Drawer, Flex,
  Form, Input, InputNumber, Modal, Popconfirm,
  Row, Select, Table, Tag, Typography, Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, DeleteOutlined, EyeOutlined,
  CheckOutlined, CloseOutlined, SendOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useProposalsPageStyles } from "./styeles/Proposalsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type {
  Proposal, ProposalLineItem,
  CreateProposalPayload, CreateLineItemPayload,
} from "@/providers/proposalsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Constants ─────────────────────────────────────────────────────────────────
const PROPOSAL_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Draft",     color: "default" },
  2: { label: "Submitted", color: "blue"    },
  3: { label: "Approved",  color: "green"   },
  4: { label: "Rejected",  color: "red"     },
};

const canManage = () => {
  try {
    const raw = localStorage.getItem("roles");
    if (!raw) return false;
    const roles = JSON.parse(raw) as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch {
    return false;
  }
};

const fmt = (v?: number | null, currency = "ZAR") => {
  const n = Number(v ?? 0);
  return `${currency === "ZAR" ? "R" : ""}${n.toLocaleString()}`;
};

const calcLineTotal = (item: CreateLineItemPayload) =>
  item.quantity * item.unitPrice * (1 - item.discount / 100) * (1 + item.taxRate / 100);

interface ClientOption  { id: string; name: string }
interface ContactOption { id: string; firstName: string; lastName: string }

// ── Line Items Form ───────────────────────────────────────────────────────────
interface LineItemFormProps {
  items: CreateLineItemPayload[];
  onChange: (items: CreateLineItemPayload[]) => void;
}

const EMPTY_LINE: CreateLineItemPayload = {
  productServiceName: "", description: "",
  quantity: 1, unitPrice: 0, discount: 0, taxRate: 15,
};

const LineItemsForm = ({ items, onChange }: LineItemFormProps) => {
  const addRow    = () => onChange([...items, { ...EMPTY_LINE }]);
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update    = (i: number, key: keyof CreateLineItemPayload, val: string | number) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    onChange(next);
  };

  return (
    <Flex vertical gap={8}>
      {items.map((item, i) => (
        <Card
          key={i}
          size="small"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(112,112,112,0.3)", borderRadius: 8 }}
          extra={
            <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => removeRow(i)} />
          }
          title={<Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Item {i + 1}</Text>}
        >
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Product / Service</Text>
              <Input
                value={item.productServiceName}
                onChange={(e) => update(i, "productServiceName", e.target.value)}
                placeholder="e.g. Implementation"
                style={{ marginTop: 4 }}
              />
            </Col>
            <Col span={12}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Description</Text>
              <Input
                value={item.description}
                onChange={(e) => update(i, "description", e.target.value)}
                placeholder="Optional"
                style={{ marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Qty</Text>
              <InputNumber
                value={item.quantity} min={1}
                onChange={(v) => update(i, "quantity", v ?? 1)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Unit Price</Text>
              <InputNumber
                value={item.unitPrice} min={0} prefix="R"
                onChange={(v) => update(i, "unitPrice", v ?? 0)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Discount %</Text>
              <InputNumber
                value={item.discount} min={0} max={100}
                onChange={(v) => update(i, "discount", v ?? 0)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Tax %</Text>
              <InputNumber
                value={item.taxRate} min={0} max={100}
                onChange={(v) => update(i, "taxRate", v ?? 0)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </Col>
          </Row>
          <Flex justify="flex-end" style={{ marginTop: 8 }}>
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
              Total: <strong style={{ color: "rgba(255,255,255,0.85)" }}>R{calcLineTotal(item).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </Text>
          </Flex>
        </Card>
      ))}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addRow}
        style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(112,112,112,0.4)" }}
      >
        Add Line Item
      </Button>
    </Flex>
  );
};

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProposalPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form]     = Form.useForm();
  const [clients,  setClients]  = useState<ClientOption[]>([]);
  const [lineItems, setLineItems] = useState<CreateLineItemPayload[]>([{ ...EMPTY_LINE }]);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    instance.get("/api/clients", { params: { pageNumber: 1, pageSize: 100 } })
      .then((res) => setClients(res.data?.items ?? []))
      .catch(() => setClients([]));
  }, [open]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      validUntil: values.validUntil?.format("YYYY-MM-DD"),
      lineItems,
    });
    form.resetFields();
    setLineItems([{ ...EMPTY_LINE }]);
  };

  return (
    <Modal
      title="Create Proposal"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={680}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Q1 2026 Proposal" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Client is required" }]}>
              <Select showSearch placeholder="Select client" optionFilterProp="children">
                {clients.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="opportunityId" label="Opportunity (optional)">
              <Input placeholder="Opportunity ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="currency" label="Currency" initialValue="ZAR">
              <Select>
                <Option value="ZAR">ZAR</Option>
                <Option value="USD">USD</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="validUntil" label="Valid Until">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={2} placeholder="Brief description..." />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.3)", marginBottom: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>LINE ITEMS</Text>
        </Divider>

        <LineItemsForm items={lineItems} onChange={setLineItems} />

        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <Flex justify="flex-end" gap={8}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>Create</Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── Reject Modal ──────────────────────────────────────────────────────────────
interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isPending: boolean;
}

const RejectModal = ({ open, onClose, onSubmit, isPending }: RejectModalProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <Modal
      title="Reject Proposal"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Reject"
      okButtonProps={{ danger: true, loading: isPending }}
      destroyOnClose
    >
      <Flex vertical gap={8}>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Please provide a reason for rejection:
        </Text>
        <TextArea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Pricing too high, revise and resubmit"
        />
      </Flex>
    </Modal>
  );
};

// ── Detail Drawer ─────────────────────────────────────────────────────────────
interface DetailDrawerProps {
  proposal: Proposal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isPending: boolean;
  styles: Record<string, string>;
}

const DetailDrawer = ({
  proposal, open, onClose, onSubmit, onApprove, onReject, isPending, styles,
}: DetailDrawerProps) => {
  const status = PROPOSAL_STATUS[proposal?.status ?? 0];
  const isDraft     = proposal?.status === 1;
  const isSubmitted = proposal?.status === 2;
  const manager     = canManage();

  const lineColumns: ColumnsType<ProposalLineItem> = [
    { title: "Product / Service", dataIndex: "productServiceName", render: (v) => <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{v}</Text> },
    { title: "Qty",      dataIndex: "quantity",   width: 60,  render: (v) => <Text style={{ color: "rgba(255,255,255,0.6)" }}>{v}</Text> },
    { title: "Unit Price", dataIndex: "unitPrice", width: 110, render: (v, r: any) => <Text style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(v, r.currency)}</Text> },
    { title: "Discount", dataIndex: "discount",   width: 80,  render: (v) => <Text style={{ color: "rgba(255,255,255,0.6)" }}>{v}%</Text> },
    { title: "Tax",      dataIndex: "taxRate",     width: 70,  render: (v) => <Text style={{ color: "rgba(255,255,255,0.6)" }}>{v}%</Text> },
    { title: "Total",    dataIndex: "lineTotal",   width: 120, render: (v, r: any) => <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{fmt(v, r.currency)}</Text> },
  ];

  return (
    <Drawer
      title={proposal?.title ?? "Proposal"}
      open={open}
      onClose={onClose}
      width={640}
      extra={status && <Tag color={status.color}>{status.label}</Tag>}
      footer={
        <Flex justify="flex-end" gap={8}>
          {isDraft && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={isPending}
              onClick={() => onSubmit(proposal!.id)}
            >
              Submit
            </Button>
          )}
          {isSubmitted && manager && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={isPending}
                onClick={() => onApprove(proposal!.id)}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                loading={isPending}
                onClick={() => onReject(proposal!.id)}
              >
                Reject
              </Button>
            </>
          )}
        </Flex>
      }
    >
      {proposal && (
        <Flex vertical gap={12}>
          {/* Info Grid */}
          <Row gutter={[12, 12]}>
            {[
              { label: "Client",      value: proposal.clientName ?? "—"      },
              { label: "Opportunity", value: proposal.opportunityTitle ?? "—" },
              { label: "Currency",    value: proposal.currency               },
              { label: "Valid Until", value: proposal.validUntil ? dayjs(proposal.validUntil).format("DD MMM YYYY") : "—" },
            ].map(({ label, value }) => (
              <Col span={12} key={label}>
                <Card className={styles.drawerCard}>
                  <Text className={styles.drawerLabel}>{label}</Text>
                  <br />
                  <Text className={styles.drawerValue}>{value}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Description */}
          {proposal.description && (
            <Card className={styles.drawerCard}>
              <Text className={styles.drawerLabel}>Description</Text>
              <br />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{proposal.description}</Text>
            </Card>
          )}

          {/* Line Items */}
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Line Items
          </Text>
          <Table
            className={styles.lineItemTable}
            dataSource={proposal.lineItems ?? []}
            columns={lineColumns}
            rowKey="id"
            pagination={false}
            size="small"
            locale={{ emptyText: "No line items" }}
          />

          {/* Totals */}
          <Flex vertical gap={6} className={styles.totalsRow}>
            {[
              { label: "Subtotal",  value: fmt(proposal.subtotal,       proposal.currency) },
              { label: "Discount",  value: fmt(proposal.totalDiscount,  proposal.currency) },
              { label: "Tax",       value: fmt(proposal.totalTax,       proposal.currency) },
            ].map(({ label, value }) => (
              <Flex key={label} justify="space-between">
                <Text className={styles.totalsLabel}>{label}</Text>
                <Text className={styles.totalsValue}>{value}</Text>
              </Flex>
            ))}
            <Divider style={{ borderColor: "rgba(112,112,112,0.25)", margin: "6px 0" }} />
            <Flex justify="space-between">
              <Text className={styles.totalsFinalLabel}>Total Amount</Text>
              <Text className={styles.totalsFinalValue}>{fmt(proposal.totalAmount, proposal.currency)}</Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Drawer>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ProposalsPage = () => {
  const { styles }  = useProposalsPageStyles();
  const state       = useProposalsState();
  const { getProposals, getProposal, createProposal, deleteProposal, submitProposal, approveProposal, rejectProposal } =
    useProposalsActions();

  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [showCreate,   setShowCreate]   = useState(false);
  const [showReject,   setShowReject]   = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  useEffect(() => {
    getProposals({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    getProposals({ pageNumber, pageSize, status: statusFilter });
  }, [pageNumber, pageSize, statusFilter]);

  const items      = useMemo(() => state.proposals?.items ?? [], [state.proposals]);
  const totalCount = state.proposals?.totalCount ?? 0;

  const handleCreate = async (payload: CreateProposalPayload) => {
    await createProposal(payload);
    setShowCreate(false);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleDelete = async (id: string) => {
    await deleteProposal(id);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleView = async (id: string) => {
    await getProposal(id);
    setDrawerOpen(true);
  };

  const handleSubmit = async (id: string) => {
    await submitProposal(id);
    setDrawerOpen(false);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleApprove = async (id: string) => {
    await approveProposal(id);
    setDrawerOpen(false);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleRejectClick = (id: string) => {
    setRejectTarget(id);
    setShowReject(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectTarget) return;
    await rejectProposal(rejectTarget, { reason });
    setShowReject(false);
    setDrawerOpen(false);
    setRejectTarget(null);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const columns: ColumnsType<Proposal> = [
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
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status: number) => {
        const s = PROPOSAL_STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      width: 140,
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{fmt(v, record.currency)}</Text>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      width: 130,
      render: (d: string) => (
        <Text className={styles.cellMuted}>{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_: unknown, record: Proposal) => (
        <Flex gap={6} justify="flex-end">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onClick={() => handleView(record.id)}
          />
          {record.status === 1 && canManage() && (
            <Popconfirm
              title="Delete this proposal?"
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          )}
          {record.status === 2 && canManage() && (
            <>
              <Button
                type="text"
                icon={<CheckOutlined />}
                size="small"
                style={{ color: "#52c41a" }}
                onClick={() => handleApprove(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleRejectClick(record.id)}
              />
            </>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Proposals</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.primaryBtn}
          onClick={() => setShowCreate(true)}
        >
          Create Proposal
        </Button>
      </Flex>

      {/* Filter */}
      <Flex gap={12}>
        <Select
          placeholder="All Statuses"
          allowClear
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPageNumber(1); }}
          style={{ minWidth: 160 }}
        >
          {Object.entries(PROPOSAL_STATUS).map(([k, v]) => (
            <Option key={k} value={Number(k)}>{v.label}</Option>
          ))}
        </Select>
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
            showTotal: (total) => `${total} proposals`,
            onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
          }}
          locale={{ emptyText: "No proposals found" }}
        />
      </Card>

      {/* Create Modal */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      {/* Reject Modal */}
      <RejectModal
        open={showReject}
        onClose={() => setShowReject(false)}
        onSubmit={handleRejectSubmit}
        isPending={state.isPending}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        proposal={state.proposal ?? null}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        onApprove={handleApprove}
        onReject={handleRejectClick}
        isPending={state.isPending}
        styles={styles}
      />

    </Flex>
  );
};

export default ProposalsPage;