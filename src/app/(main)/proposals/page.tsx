"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Row, Select,
  Table, Tag, Typography, Divider, Popconfirm, Steps, Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, DeleteOutlined,
  CheckOutlined, CloseOutlined, SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useProposalsPageStyles } from "./styeles/Proposalsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type {
  Proposal, CreateProposalPayload, CreateLineItemPayload,
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
    const roles = JSON.parse(localStorage.getItem("roles") ?? "[]") as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch {
    return false;
  }
};

const fmt = (v?: number | null, currency = "ZAR") => {
  const n = Number(v ?? 0);
  return `${currency === "ZAR" ? "R" : "$"}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calcLineTotal = (item: CreateLineItemPayload) =>
  item.quantity * item.unitPrice * (1 - item.discount / 100) * (1 + item.taxRate / 100);

// ── Types ─────────────────────────────────────────────────────────────────────
interface OpportunityOption { id: string; title: string; }

// ── Line Items ────────────────────────────────────────────────────────────────
const EMPTY_LINE: CreateLineItemPayload = {
  productServiceName: "", description: "",
  quantity: 1, unitPrice: 0, discount: 0, taxRate: 15,
};

interface LineItemsFormProps {
  items: CreateLineItemPayload[];
  currency: string;
  onChange: (items: CreateLineItemPayload[]) => void;
}

const LineItemsForm = ({ items, currency, onChange }: LineItemsFormProps) => {
  const addRow    = () => onChange([...items, { ...EMPTY_LINE }]);
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update    = (i: number, key: keyof CreateLineItemPayload, val: string | number) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    onChange(next);
  };

  const grandTotal = items.reduce((sum, item) => sum + calcLineTotal(item), 0);
  const currencyPrefix = currency === "ZAR" ? "R" : "$";

  return (
    <Flex vertical gap={12}>
      {/* Header hint */}
      <Flex align="center" gap={6} style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(112,112,112,0.2)",
        borderRadius: 8,
        padding: "8px 12px",
      }}>
        <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.4)" }} />
        <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          Add each product or service you're quoting. Totals are calculated automatically.
        </Text>
      </Flex>

      {items.map((item, i) => (
        <Card
          key={i}
          size="small"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(112,112,112,0.3)",
            borderRadius: 10,
          }}
          title={
            <Flex align="center" gap={8}>
              <span style={{
                background: "rgba(112,112,112,0.3)",
                color: "#fff",
                borderRadius: "50%",
                width: 20, height: 20,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}>
                {i + 1}
              </span>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
                {item.productServiceName || "New Item"}
              </Text>
            </Flex>
          }
          extra={
            items.length > 1 && (
              <Button
                type="text" danger icon={<DeleteOutlined />} size="small"
                onClick={() => removeRow(i)}
              />
            )
          }
        >
          <Flex vertical gap={12}>
            {/* Row 1: Name + Description */}
            <Row gutter={12}>
              <Col span={12}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>
                    Product / Service <span style={{ color: "#ff4d4f" }}>*</span>
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                    Name of what you're selling
                  </Text>
                  <Input
                    value={item.productServiceName}
                    onChange={(e) => update(i, "productServiceName", e.target.value)}
                    placeholder="e.g. Software Implementation"
                    style={{ marginTop: 2 }}
                  />
                </Flex>
              </Col>
              <Col span={12}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>
                    Description
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                    Optional detail for the client
                  </Text>
                  <Input
                    value={item.description}
                    onChange={(e) => update(i, "description", e.target.value)}
                    placeholder="e.g. Initial setup and configuration"
                    style={{ marginTop: 2 }}
                  />
                </Flex>
              </Col>
            </Row>

            {/* Row 2: Qty, Unit Price, Discount, Tax */}
            <Row gutter={12}>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Quantity</Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>How many units</Text>
                  <InputNumber
                    value={item.quantity} min={1}
                    onChange={(v) => update(i, "quantity", v ?? 1)}
                    style={{ width: "100%", marginTop: 2 }}
                  />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Unit Price</Text>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Price per unit</Text>
                  <InputNumber
                    value={item.unitPrice} min={0} prefix={currencyPrefix}
                    onChange={(v) => update(i, "unitPrice", v ?? 0)}
                    style={{ width: "100%", marginTop: 2 }}
                  />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Flex align="center" gap={4}>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Discount</Text>
                    <Tooltip title="% off the unit price before tax">
                      <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    </Tooltip>
                  </Flex>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>% reduction</Text>
                  <InputNumber
                    value={item.discount} min={0} max={100} suffix="%"
                    onChange={(v) => update(i, "discount", v ?? 0)}
                    style={{ width: "100%", marginTop: 2 }}
                  />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical gap={4}>
                  <Flex align="center" gap={4}>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Tax Rate</Text>
                    <Tooltip title="VAT or applicable tax. South Africa standard is 15%">
                      <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    </Tooltip>
                  </Flex>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Default: 15% VAT</Text>
                  <InputNumber
                    value={item.taxRate} min={0} max={100} suffix="%"
                    onChange={(v) => update(i, "taxRate", v ?? 0)}
                    style={{ width: "100%", marginTop: 2 }}
                  />
                </Flex>
              </Col>
            </Row>

            {/* Line total */}
            <Flex
              justify="flex-end"
              align="center"
              gap={8}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 6,
                padding: "6px 12px",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {item.quantity} × {currencyPrefix}{item.unitPrice.toLocaleString()}
                {item.discount > 0 && ` − ${item.discount}%`}
                {` + ${item.taxRate}% tax`}
                {" ="}
              </Text>
              <Text style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {fmt(calcLineTotal(item), currency)}
              </Text>
            </Flex>
          </Flex>
        </Card>
      ))}

      {/* Add Item + Grand Total */}
      <Flex justify="space-between" align="center">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addRow}
          style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(112,112,112,0.4)" }}
        >
          Add Another Item
        </Button>

        {items.length > 0 && (
          <Flex
            align="center"
            gap={12}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(112,112,112,0.3)",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Grand Total</Text>
            <Text style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>
              {fmt(grandTotal, currency)}
            </Text>
          </Flex>
        )}
      </Flex>
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

const SectionLabel = ({ step, title, subtitle }: { step: number; title: string; subtitle: string }) => (
  <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
    <span style={{
      background: "#707070",
      color: "#fff",
      borderRadius: "50%",
      width: 24, height: 24,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
    }}>
      {step}
    </span>
    <Flex vertical gap={1}>
      <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{subtitle}</Text>
    </Flex>
  </Flex>
);

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form]          = Form.useForm();
  const [opportunities, setOpportunities] = useState<OpportunityOption[]>([]);
  const [loadingOpp,    setLoadingOpp]    = useState(false);
  const [lineItems,     setLineItems]     = useState<CreateLineItemPayload[]>([{ ...EMPTY_LINE }]);
  const [currency,      setCurrency]      = useState("ZAR");
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoadingOpp(true);
    instance
      .get("/api/opportunities", { params: { pageNumber: 1, pageSize: 100 } })
      .then((res) => setOpportunities(res.data?.items ?? []))
      .catch(() => setOpportunities([]))
      .finally(() => setLoadingOpp(false));
  }, [open]);

  const handleFinish = (values: any) => {
    const payload: CreateProposalPayload = {
      opportunityId: values.opportunityId,
      title:         values.title,
      description:   values.description,
      currency:      values.currency,
      validUntil:    values.validUntil?.toISOString(),
      lineItems,
    };
    onSubmit(payload);
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
          <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 700 }}>
            Request a Proposal
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
            Fill in the details below — all fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required
          </Text>
        </Flex>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ currency: "ZAR", taxRate: 15 }}
      >
        {/* ── Section 1: Link to Opportunity ── */}
        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "8px 0 16px" }} />
        <SectionLabel
          step={1}
          title="Link to an Opportunity"
          subtitle="Which deal or lead is this proposal for?"
        />

        <Form.Item
          name="opportunityId"
          label={
            <Flex align="center" gap={6}>
              <span>Opportunity</span>
              <Tooltip title="Select the sales opportunity this proposal is tied to. This links the proposal to the correct client and deal.">
                <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }} />
              </Tooltip>
            </Flex>
          }
          rules={[{ required: true, message: "Please select an opportunity" }]}
        >
          <Select
            showSearch
            placeholder="Search and select an opportunity…"
            loading={loadingOpp}
            optionFilterProp="children"
            notFoundContent={loadingOpp ? "Loading…" : "No opportunities found"}
          >
            {opportunities.map((o) => (
              <Option key={o.id} value={o.id}>{o.title}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* ── Section 2: Proposal Details ── */}
        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel
          step={2}
          title="Proposal Details"
          subtitle="Give this proposal a clear name and set the terms"
        />

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
            <Form.Item
              name="currency"
              label="Currency"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>All line item prices will use this currency</Text>}
            >
              <Select onChange={(v) => setCurrency(v)}>
                <Option value="ZAR">ZAR – South African Rand (R)</Option>
                <Option value="USD">USD – US Dollar ($)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="validUntil"
              label="Valid Until"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>The date this proposal expires</Text>}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(d) => d && d.isBefore(dayjs(), "day")}
                placeholder="Select expiry date"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Optional — provide context or notes for the client</Text>}
        >
          <TextArea
            rows={3}
            placeholder="e.g. This proposal covers the annual support and maintenance package discussed in our meeting on 10 Jan."
          />
        </Form.Item>

        {/* ── Section 3: Line Items ── */}
        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel
          step={3}
          title="Line Items"
          subtitle="Add each product or service you're quoting. At least one is required."
        />

        <LineItemsForm items={lineItems} currency={currency} onChange={setLineItems} />

        {/* ── Footer ── */}
        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "20px 0 16px" }} />
        <Flex justify="space-between" align="center">
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            The proposal will be saved as a <strong style={{ color: "rgba(255,255,255,0.5)" }}>Draft</strong> — you can submit it for approval afterwards.
          </Text>
          <Flex gap={8}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button className={undefined} style={{
              backgroundColor: "#707070",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              boxShadow: "none",
            }} htmlType="submit" loading={isPending}>
              Save as Draft
            </Button>
          </Flex>
        </Flex>

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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
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

  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [showCreate,   setShowCreate]   = useState(false);
  const [showReject,   setShowReject]   = useState(false);
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

  const handleSubmit = async (id: string) => {
    await submitProposal(id);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleApprove = async (id: string) => {
    await approveProposal(id);
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
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: unknown, record: Proposal) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          {record.status === 1 && (
            <>
              <Popconfirm
                title="Submit this proposal for approval?"
                okText="Submit" cancelText="Cancel"
                onConfirm={() => handleSubmit(record.id)}
              >
                <Button
                  size="small"
                  icon={<SendOutlined />}
                  style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
                >
                  Submit
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Delete this draft proposal?"
                okText="Delete" cancelText="Cancel"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleDelete(record.id)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} style={{ boxShadow: "none" }}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status === 2 && canManage() && (
            <>
              <Button
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", boxShadow: "none" }}
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button
                size="small" danger
                icon={<CloseOutlined />}
                style={{ boxShadow: "none" }}
                onClick={() => handleRejectClick(record.id)}
              >
                Reject
              </Button>
            </>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Proposals</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Request Proposal
        </Button>
      </Flex>

      <Flex gap={12}>
        <Select
          className={styles.filterSelect}
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

      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      <RejectModal
        open={showReject}
        onClose={() => setShowReject(false)}
        onSubmit={handleRejectSubmit}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default ProposalsPage;