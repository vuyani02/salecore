"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Descriptions, Divider, Dropdown,
  Flex, Form, Input, InputNumber, Modal, Row, Select,
  Table, Tag, Typography, Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, DeleteOutlined, MoreOutlined,
  CheckOutlined, CloseOutlined, SendOutlined,
  InfoCircleOutlined, EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunitiesProvider";
import { useProposalsPageStyles } from "./styeles/Proposalsstyles";
import type {
  IProposal, ICreateProposalPayload, ICreateLineItemPayload,
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

const fmt = (v?: number | null, currency = "ZAR") => {
  const n = Number(v ?? 0);
  return `${currency === "ZAR" ? "R" : "$"}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calcLineTotal = (item: ICreateLineItemPayload) =>
  item.quantity * item.unitPrice * (1 - item.discount / 100) * (1 + item.taxRate / 100);

const EMPTY_LINE: ICreateLineItemPayload = {
  productServiceName: "", description: "",
  quantity: 1, unitPrice: 0, discount: 0, taxRate: 15,
};

// ── Line Items Form ───────────────────────────────────────────────────────────
const LineItemsForm = ({ items, currency, onChange }: {
  items: ICreateLineItemPayload[]; currency: string; onChange: (items: ICreateLineItemPayload[]) => void;
}) => {
  const addRow    = () => onChange([...items, { ...EMPTY_LINE }]);
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update    = (i: number, key: keyof ICreateLineItemPayload, val: string | number) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    onChange(next);
  };

  const grandTotal     = items.reduce((sum, item) => sum + calcLineTotal(item), 0);
  const currencyPrefix = currency === "ZAR" ? "R" : "$";

  return (
    <Flex vertical gap={12}>
      <Flex align="center" gap={6} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(112,112,112,0.2)", borderRadius: 8, padding: "8px 12px" }}>
        <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.4)" }} />
        <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          Add each product or service you're quoting. Totals are calculated automatically.
        </Text>
      </Flex>

      {items.map((item, i) => (
        <Card
          key={i}
          size="small"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(112,112,112,0.3)", borderRadius: 10 }}
          title={
            <Flex align="center" gap={8}>
              <span style={{ background: "rgba(112,112,112,0.3)", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                {i + 1}
              </span>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
                {item.productServiceName || "New Item"}
              </Text>
            </Flex>
          }
          extra={items.length > 1 && (
            <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => removeRow(i)} />
          )}
        >
          <Flex vertical gap={12}>
            <Row gutter={12}>
              <Col span={12}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>
                    Product / Service <span style={{ color: "#ff4d4f" }}>*</span>
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Name of what you're selling</Text>
                  <Input value={item.productServiceName} onChange={(e) => update(i, "productServiceName", e.target.value)} placeholder="e.g. Software Implementation" style={{ marginTop: 2 }} />
                </Flex>
              </Col>
              <Col span={12}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Description</Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Optional detail for the client</Text>
                  <Input value={item.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="e.g. Initial setup and configuration" style={{ marginTop: 2 }} />
                </Flex>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Quantity</Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>How many units</Text>
                  <InputNumber value={item.quantity} min={1} onChange={(v) => update(i, "quantity", v ?? 1)} style={{ width: "100%", marginTop: 2 }} />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Unit Price</Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Price per unit</Text>
                  <InputNumber value={item.unitPrice} min={0} prefix={currencyPrefix} onChange={(v) => update(i, "unitPrice", v ?? 0)} style={{ width: "100%", marginTop: 2 }} />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Flex align="center" gap={4}>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Discount</Text>
                    <Tooltip title="% off the unit price before tax"><InfoCircleOutlined style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }} /></Tooltip>
                  </Flex>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>% reduction</Text>
                  <InputNumber value={item.discount} min={0} max={100} suffix="%" onChange={(v) => update(i, "discount", v ?? 0)} style={{ width: "100%", marginTop: 2 }} />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Flex align="center" gap={4}>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Tax Rate</Text>
                    <Tooltip title="VAT or applicable tax. South Africa standard is 15%"><InfoCircleOutlined style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }} /></Tooltip>
                  </Flex>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Default: 15% VAT</Text>
                  <InputNumber value={item.taxRate} min={0} max={100} suffix="%" onChange={(v) => update(i, "taxRate", v ?? 0)} style={{ width: "100%", marginTop: 2 }} />
                </Flex>
              </Col>
            </Row>

            <Flex justify="flex-end" align="center" gap={8} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 12px" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {item.quantity} × {currencyPrefix}{item.unitPrice.toLocaleString()}
                {item.discount > 0 && ` − ${item.discount}%`}
                {` + ${item.taxRate}% tax =`}
              </Text>
              <Text style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{fmt(calcLineTotal(item), currency)}</Text>
            </Flex>
          </Flex>
        </Card>
      ))}

      <Flex justify="space-between" align="center">
        <Button type="dashed" icon={<PlusOutlined />} onClick={addRow} style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(112,112,112,0.4)" }}>
          Add Another Item
        </Button>
        {items.length > 0 && (
          <Flex align="center" gap={12} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(112,112,112,0.3)", borderRadius: 8, padding: "8px 16px" }}>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Grand Total</Text>
            <Text style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>{fmt(grandTotal, currency)}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

// ── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ step, title, subtitle }: { step: number; title: string; subtitle: string }) => (
  <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
    <span style={{ background: "#707070", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
      {step}
    </span>
    <Flex vertical gap={1}>
      <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{subtitle}</Text>
    </Flex>
  </Flex>
);

// ── Create Modal ──────────────────────────────────────────────────────────────
const CreateModal = ({ open, onClose, onSubmit, isPending }: {
  open: boolean; onClose: () => void; onSubmit: (p: ICreateProposalPayload) => void; isPending: boolean;
}) => {
  const [form]      = Form.useForm();
  const [lineItems, setLineItems] = useState<ICreateLineItemPayload[]>([{ ...EMPTY_LINE }]);
  const [currency,  setCurrency]  = useState("ZAR");

  const oppsState            = useOpportunitiesState();
  const { getOpportunities } = useOpportunitiesActions();

  useEffect(() => {
    if (!open) return;
    if (!oppsState.opportunities?.items?.length) getOpportunities({ pageNumber: 1, pageSize: 100 });
  }, [open]);

  const opportunities = oppsState.opportunities?.items ?? [];

  const handleFinish = (values: any) => {
    onSubmit({
      opportunityId: values.opportunityId,
      title:         values.title,
      description:   values.description,
      currency:      values.currency,
      validUntil:    values.validUntil?.toISOString(),
      lineItems,
    });
    form.resetFields();
    setLineItems([{ ...EMPTY_LINE }]);
    setCurrency("ZAR");
  };

  const handleClose = () => {
    form.resetFields();
    setLineItems([{ ...EMPTY_LINE }]);
    setCurrency("ZAR");
    onClose();
  };

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 700 }}>Request a Proposal</Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
            Fill in the details below — all fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required
          </Text>
        </Flex>
      }
      open={open} onCancel={handleClose} footer={null} destroyOnHidden width={720}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ currency: "ZAR", taxRate: 15 }}>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "8px 0 16px" }} />
        <SectionLabel step={1} title="Link to an Opportunity" subtitle="Which deal or lead is this proposal for?" />

        <Form.Item
          name="opportunityId"
          label={
            <Flex align="center" gap={6}>
              <span>Opportunity</span>
              <Tooltip title="Select the sales opportunity this proposal is tied to.">
                <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }} />
              </Tooltip>
            </Flex>
          }
          rules={[{ required: true, message: "Please select an opportunity" }]}
        >
          <Select showSearch placeholder="Search and select an opportunity…" loading={oppsState.isPending} optionFilterProp="children" notFoundContent={oppsState.isPending ? "Loading…" : "No opportunities found"}>
            {opportunities.map((o) => <Option key={o.id} value={o.id}>{o.title}</Option>)}
          </Select>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={2} title="Proposal Details" subtitle="Give this proposal a clear name and set the terms" />

        <Form.Item
          name="title"
          label="Proposal Title"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>e.g. "Q2 2026 – Annual Support Agreement"</Text>}
          rules={[{ required: true, message: "Please enter a proposal title" }]}
        >
          <Input placeholder="Give this proposal a descriptive name" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="currency" label="Currency" extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>All line item prices will use this currency</Text>}>
              <Select onChange={(v) => setCurrency(v)}>
                <Option value="ZAR">ZAR – South African Rand (R)</Option>
                <Option value="USD">USD – US Dollar ($)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="validUntil" label="Valid Until" extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>The date this proposal expires</Text>}>
              <DatePicker style={{ width: "100%" }} disabledDate={(d) => d && d.isBefore(dayjs(), "day")} placeholder="Select expiry date" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Optional — provide context or notes for the client</Text>}>
          <TextArea rows={3} placeholder="e.g. This proposal covers the annual support and maintenance package discussed in our meeting on 10 Jan." />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={3} title="Line Items" subtitle="Add each product or service you're quoting. At least one is required." />

        <LineItemsForm items={lineItems} currency={currency} onChange={setLineItems} />

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "20px 0 16px" }} />
        <Flex justify="space-between" align="center">
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            The proposal will be saved as a <strong style={{ color: "rgba(255,255,255,0.5)" }}>Draft</strong> — you can submit it for approval afterwards.
          </Text>
          <Flex gap={8}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }} htmlType="submit" loading={isPending}>
              Save as Draft
            </Button>
          </Flex>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ proposal, open, onClose, styles }: {
  proposal: IProposal | null; open: boolean; onClose: () => void; styles: any;
}) => {
  if (!proposal) return null;

  const status = PROPOSAL_STATUS[proposal.status];

  // Line items columns (read-only)
  const lineItemCols = [
    { title: "Product / Service", dataIndex: "productServiceName", render: (v: string) => <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{v}</Text> },
    { title: "Description",       dataIndex: "description",        render: (v: string) => <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{v || "—"}</Text> },
    { title: "Qty",   dataIndex: "quantity",   width: 60,  render: (v: number) => <Text style={{ color: "rgba(255,255,255,0.7)" }}>{v}</Text> },
    { title: "Price", dataIndex: "unitPrice",  width: 100, render: (v: number, r: any) => <Text style={{ color: "rgba(255,255,255,0.7)" }}>{fmt(v, proposal.currency)}</Text> },
    { title: "Disc%", dataIndex: "discount",   width: 70,  render: (v: number) => <Text style={{ color: "rgba(255,255,255,0.55)" }}>{v}%</Text> },
    { title: "Tax%",  dataIndex: "taxRate",    width: 70,  render: (v: number) => <Text style={{ color: "rgba(255,255,255,0.55)" }}>{v}%</Text> },
    {
      title: "Total",
      width: 110,
      render: (_: any, r: any) => (
        <Text style={{ color: "#fff", fontWeight: 700 }}>
          {fmt(r.quantity * r.unitPrice * (1 - r.discount / 100) * (1 + r.taxRate / 100), proposal.currency)}
        </Text>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={820}
      title={
        <Flex vertical gap={6}>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 700 }}>{proposal.title}</Text>
          <Flex gap={6}>
            {status && <Tag color={status.color} style={{ marginInlineEnd: 0 }}>{status.label}</Tag>}
            <Tag style={{ marginInlineEnd: 0, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(112,112,112,0.3)", color: "rgba(255,255,255,0.6)" }}>
              {proposal.currency}
            </Tag>
          </Flex>
        </Flex>
      }
    >
      {/* Details */}
      <Descriptions
        column={2}
        size="small"
        style={{ marginBottom: 16 }}
        labelStyle={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}
        contentStyle={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}
      >
        <Descriptions.Item label="Client">{proposal.clientName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Opportunity">{proposal.opportunityTitle ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Valid Until">
          {proposal.validUntil ? dayjs(proposal.validUntil).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {proposal.createdAt ? dayjs(proposal.createdAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
        {proposal.description && (
          <Descriptions.Item label="Description" span={2}>{proposal.description}</Descriptions.Item>
        )}
        {proposal.rejectionReason && (
          <Descriptions.Item label="Rejection Reason" span={2}>
            <Text style={{ color: "rgba(255,77,79,0.85)" }}>{proposal.rejectionReason}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ borderColor: "rgba(112,112,112,0.25)", margin: "0 0 16px" }} />

      {/* Line items */}
      <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
        Line Items
      </Text>
      <Table
        className={styles.lineItemTable}
        dataSource={proposal.lineItems ?? []}
        columns={lineItemCols}
        rowKey={(_, i) => String(i)}
        pagination={false}
        size="small"
        locale={{ emptyText: "No line items" }}
      />

      {/* Totals */}
      {(proposal.lineItems?.length ?? 0) > 0 && (
        <Flex vertical gap={6} style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(112,112,112,0.25)", borderRadius: 8 }}>
          <Flex justify="space-between">
            <Text className={styles.totalsLabel}>Subtotal</Text>
            <Text className={styles.totalsValue}>{fmt(proposal.subtotal, proposal.currency)}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text className={styles.totalsLabel}>Tax</Text>
            <Text className={styles.totalsValue}>{fmt(proposal.totalTax, proposal.currency)}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text className={styles.totalsLabel}>Discount</Text>
            <Text className={styles.totalsValue}>−{fmt(proposal.totalDiscount, proposal.currency)}</Text>
          </Flex>
          <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0" }} />
          <Flex justify="space-between">
            <Text className={styles.totalsFinalLabel}>Total</Text>
            <Text className={styles.totalsFinalValue}>{fmt(proposal.totalAmount, proposal.currency)}</Text>
          </Flex>
        </Flex>
      )}
    </Modal>
  );
};

// ── Reject Modal ──────────────────────────────────────────────────────────────
const RejectModal = ({ open, onClose, onSubmit, isPending }: {
  open: boolean; onClose: () => void; onSubmit: (reason: string) => void; isPending: boolean;
}) => {
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
      onCancel={() => { setReason(""); onClose(); }}
      onOk={handleSubmit}
      okText="Reject"
      okButtonProps={{ danger: true, loading: isPending, disabled: !reason.trim() }}
      destroyOnHidden
    >
      <Flex vertical gap={8}>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Please provide a reason for rejection:</Text>
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

// ── Page ──────────────────────────────────────────────────────────────────────
const ProposalsPage = () => {
  const { styles }  = useProposalsPageStyles();
  const state       = useProposalsState();
  const { getProposals, createProposal, deleteProposal, submitProposal, approveProposal, rejectProposal } =
    useProposalsActions();

  // ── Mounted + role ────────────────────────────────────────────────────────
  const [canManage, setCanManage] = useState(false);
  useEffect(() => {
    const role = localStorage.getItem("user_role") ?? "";
    setCanManage(["Admin", "SalesManager"].includes(role));
  }, []);

  // ── State ─────────────────────────────────────────────────────────────────
  const [pageNumber,    setPageNumber]    = useState(1);
  const [pageSize,      setPageSize]      = useState(10);
  const [statusFilter,  setStatusFilter]  = useState<number | undefined>();
  const [showCreate,    setShowCreate]    = useState(false);
  const [viewTarget,    setViewTarget]    = useState<IProposal | null>(null);
  const [submitTarget,  setSubmitTarget]  = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [rejectTarget,  setRejectTarget]  = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);

  useEffect(() => { getProposals({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { getProposals({ pageNumber, pageSize, status: statusFilter }); }, [pageNumber, pageSize, statusFilter]);

  const items      = useMemo(() => state.proposals?.items ?? [], [state.proposals]);
  const totalCount = state.proposals?.totalCount ?? 0;

  const refresh = () => getProposals({ pageNumber, pageSize, status: statusFilter });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async (payload: ICreateProposalPayload) => {
    await createProposal(payload);
    setShowCreate(false);
    refresh();
  };

  const handleSubmit = async () => {
    if (!submitTarget) return;
    await submitProposal(submitTarget);
    setSubmitTarget(null);
    refresh();
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    await approveProposal(approveTarget);
    setApproveTarget(null);
    refresh();
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    await rejectProposal(rejectTarget, { reason });
    setRejectTarget(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProposal(deleteTarget);
    setDeleteTarget(null);
    refresh();
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: ColumnsType<IProposal> = [
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
      render: (status: number) => {
        const s = PROPOSAL_STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{fmt(v, record.currency)}</Text>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      render: (d: string) => {
        const isExpired = d && dayjs(d).isBefore(dayjs(), "day");
        return (
          <Text style={{ color: isExpired ? "rgba(255,77,79,0.85)" : "rgba(255,255,255,0.55)" }}>
            {d ? dayjs(d).format("DD MMM YYYY") : "—"}
          </Text>
        );
      },
    },
    {
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_: unknown, record: IProposal) => {
        const menuItems = [
          // View — always available
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => setViewTarget(record),
          },

          // ── Draft actions ──
          ...(record.status === 1 ? [
            {
              key: "submit",
              label: "Submit for Approval",
              icon: <SendOutlined />,
              onClick: () => setSubmitTarget(record.id),
            },
            { type: "divider" as const },
            {
              key: "delete",
              label: "Delete Draft",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => setDeleteTarget(record.id),
            },
          ] : []),

          // ── Submitted — approve/reject (Admin/SalesManager only) ──
          ...(record.status === 2 && canManage ? [
            {
              key: "approve",
              label: "Approve",
              icon: <CheckOutlined />,
              onClick: () => setApproveTarget(record.id),
            },
            {
              key: "reject",
              label: "Reject",
              icon: <CloseOutlined />,
              danger: true,
              onClick: () => setRejectTarget(record.id),
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

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Proposals</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          New Proposal
        </Button>
      </Flex>

      {/* Status filter */}
      <Flex gap={12}>
        <Select
          placeholder="All Statuses"
          allowClear
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPageNumber(1); }}
          style={{ minWidth: 160, background: "#707070", border: "none" }}
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

      {/* ── Modals ── */}
      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} isPending={state.isPending} />

      <ViewModal proposal={viewTarget} open={!!viewTarget} onClose={() => setViewTarget(null)} styles={styles} />

      <RejectModal open={!!rejectTarget} onClose={() => setRejectTarget(null)} onSubmit={handleReject} isPending={state.isPending} />

      {/* Submit confirmation */}
      <Modal
        open={!!submitTarget}
        onCancel={() => setSubmitTarget(null)}
        onOk={handleSubmit}
        okText="Submit for Approval"
        okButtonProps={{ style: { backgroundColor: "#707070", border: "none", boxShadow: "none" }, loading: state.isPending }}
        cancelText="Cancel"
        title="Submit Proposal"
        width={420}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Once submitted, the proposal will be locked for editing until it is approved or rejected by an Admin or Sales Manager.
        </Text>
      </Modal>

      {/* Approve confirmation */}
      <Modal
        open={!!approveTarget}
        onCancel={() => setApproveTarget(null)}
        onOk={handleApprove}
        okText="Approve"
        okButtonProps={{ style: { backgroundColor: "#1a7a3a", border: "none", boxShadow: "none" }, loading: state.isPending }}
        cancelText="Cancel"
        title="Approve Proposal"
        width={420}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Approving this proposal will allow the team to proceed with creating a contract. This action cannot be undone.
        </Text>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: state.isPending }}
        cancelText="Cancel"
        title="Delete Draft Proposal"
        width={420}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Are you sure you want to delete this draft? This action cannot be undone.
        </Text>
      </Modal>

    </Flex>
  );
};

export default ProposalsPage;