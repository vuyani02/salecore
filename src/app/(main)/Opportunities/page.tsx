"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Popconfirm,
  Row, Select, Table, Tag, Tabs, Timeline,
  Typography, Divider, Tooltip, Dropdown
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, SwapOutlined, UserSwitchOutlined,
  DeleteOutlined, HistoryOutlined, SearchOutlined, EditOutlined,
  MoreOutlined, RobotOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useOpportunitiesActions, useOpportunitiesState } from "@/providers/opportunitiesProvider";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useUsersState, useUsersActions } from "@/providers/usersProvider";
import { useOpportunitiesPageStyles } from "./styeles/OpportunitiesStyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { Opportunity, CreateOpportunityPayload } from "@/types/opportunities";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Gemini ────────────────────────────────────────────────────────────────────
// Move this to .env.local as NEXT_PUBLIC_GEMINI_API_KEY and regenerate your key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "AIzaSyD5BQ-JkA7eYR2uWQnDRwsydpqpqygZeBk";

const callGemini = async (prompt: string): Promise<string> => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error("Gemini API error");
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary available.";
};

// ── Constants ─────────────────────────────────────────────────────────────────
const STAGES: Record<number, { label: string; color: string }> = {
  1: { label: "Lead",         color: "purple" },
  2: { label: "Qualified",    color: "blue"   },
  3: { label: "Proposal",     color: "gold"   },
  4: { label: "Negotiation",  color: "cyan"   },
  5: { label: "Closed Won",   color: "green"  },
  6: { label: "Closed Lost",  color: "red"    },
};

const SOURCES: Record<number, string> = {
  1: "Inbound",
  2: "Outbound",
  3: "Referral",
  4: "Partner",
  5: "RFP",
};

const STAGE_OPTIONS = Object.entries(STAGES).map(([k, v]) => ({ value: Number(k), label: v.label }));
const SOURCE_OPTIONS = Object.entries(SOURCES).map(([k, v]) => ({ value: Number(k), label: v }));

type TabKey = "all" | "mine" | "pipeline";

const formatValue = (value?: number | null, currency?: string | null) => {
  const v = Number(value ?? 0);
  const prefix = (currency ?? "ZAR").toUpperCase() === "ZAR" ? "R" : "$";
  return `${prefix}${v.toLocaleString()}`;
};

// ── Stage History Modal ───────────────────────────────────────────────────────
interface StageHistoryModalProps {
  opportunityId: string | null;
  open: boolean;
  onClose: () => void;
}

const StageHistoryModal = ({ opportunityId, open, onClose }: StageHistoryModalProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open || !opportunityId) return;
    setLoading(true);
    instance
      .get(`/api/opportunities/${opportunityId}/stage-history`)
      .then((r) => setHistory(r.data ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [open, opportunityId]);

  return (
    <Modal title="Stage History" open={open} onCancel={onClose} footer={null} destroyOnHidden width={480}>
      {loading ? (
        <Flex justify="center" style={{ padding: 24 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</Text>
        </Flex>
      ) : history.length === 0 ? (
        <Text style={{ color: "rgba(255,255,255,0.4)" }}>No stage changes recorded yet.</Text>
      ) : (
        <Timeline
          style={{ marginTop: 16 }}
          items={history.map((h) => ({
            color: STAGES[h.toStage]?.color ?? "gray",
            children: (
              <Flex vertical gap={2}>
                <Flex gap={8} align="center">
                  {h.fromStage && (
                    <>
                      <Tag color={STAGES[h.fromStage]?.color}>{STAGES[h.fromStage]?.label}</Tag>
                      <Text style={{ color: "rgba(255,255,255,0.4)" }}>→</Text>
                    </>
                  )}
                  <Tag color={STAGES[h.toStage]?.color}>{STAGES[h.toStage]?.label}</Tag>
                </Flex>
                {h.notes && <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{h.notes}</Text>}
                {h.lossReason && <Text style={{ color: "rgba(255,77,79,0.8)", fontSize: 12 }}>Loss reason: {h.lossReason}</Text>}
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  {h.changedByName} · {h.changedAt ? dayjs(h.changedAt).format("DD MMM YYYY HH:mm") : "—"}
                </Text>
              </Flex>
            ),
          }))}
        />
      )}
    </Modal>
  );
};

// ── Move Stage Modal ──────────────────────────────────────────────────────────
interface MoveStageModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, payload: { stage: number; notes?: string; lossReason?: string }) => void;
  isPending: boolean;
}

const MoveStageModal = ({ opportunity, open, onClose, onSubmit, isPending }: MoveStageModalProps) => {
  const [form] = Form.useForm();
  const [selectedStage, setSelectedStage] = useState<number | undefined>();

  useEffect(() => {
    if (open) {
      form.resetFields();
      setSelectedStage(undefined);
    }
  }, [open]);

  const handleFinish = (values: any) => {
    if (!opportunity) return;
    onSubmit(opportunity.id, {
      stage:      values.stage,
      notes:      values.notes,
      lossReason: values.lossReason,
    });
  };

  return (
    <Modal title="Move Stage" open={open} onCancel={onClose} footer={null} destroyOnHidden width={440}>
      {opportunity && (
        <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Current stage:</Text>
          <Tag color={STAGES[opportunity.stage]?.color}>{STAGES[opportunity.stage]?.label}</Tag>
        </Flex>
      )}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="stage" label="Move To" rules={[{ required: true, message: "Select a stage" }]}>
          <Select placeholder="Select new stage" onChange={(v) => setSelectedStage(v)}>
            {STAGE_OPTIONS.filter((s) => s.value !== opportunity?.stage).map((s) => (
              <Option key={s.value} value={s.value}>
                <Tag color={STAGES[s.value]?.color} style={{ marginInlineEnd: 6 }}>{s.label}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={2} placeholder="Optional notes about this stage change..." />
        </Form.Item>

        {selectedStage === 6 && (
          <Form.Item name="lossReason" label="Loss Reason" rules={[{ required: true, message: "Loss reason is required for Closed Lost" }]}>
            <Input.TextArea rows={2} placeholder="Why was this opportunity lost?" />
          </Form.Item>
        )}

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Move Stage
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Assign Modal ──────────────────────────────────────────────────────────────
interface AssignModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, userId: string) => void;
  isPending: boolean;
}

const AssignModal = ({ opportunity, open, onClose, onSubmit, isPending }: AssignModalProps) => {
  const [form]       = Form.useForm();
  const usersState   = useUsersState();
  const { getUsers } = useUsersActions();

  useEffect(() => {
    if (!open) return;
    if (!usersState.users?.items?.length) getUsers({ isActive: true, pageSize: 100 });
    form.resetFields();
  }, [open]);

  const users = usersState.users?.items ?? [];

  const handleFinish = (values: any) => {
    if (!opportunity) return;
    onSubmit(opportunity.id, values.userId);
  };

  return (
    <Modal title="Assign Opportunity" open={open} onCancel={onClose} footer={null} destroyOnHidden width={400}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="userId" label="Assign To" rules={[{ required: true, message: "Select a user" }]}>
          <Select
            showSearch
            placeholder="Select a team member"
            loading={usersState.isPending}
            optionFilterProp="children"
          >
            {users.map((u) => <Option key={u.id} value={u.id}>{u.fullName} — {u.roles?.[0]}</Option>)}
          </Select>
        </Form.Item>
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Assign
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOpportunityPayload) => void;
  isPending: boolean;
  initial?: Opportunity | null;
}

const CreateModal = ({ open, onClose, onSubmit, isPending, initial }: CreateModalProps) => {
  const [form]          = Form.useForm();
  const isEdit          = !!initial;
  const [contacts,      setContacts]      = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const instance = getAxiosInstance();

  const clientsState   = useClientsState();
  const { getClients } = useClientsActions();

  useEffect(() => {
    if (!open) return;
    if (!clientsState.clients?.items?.length) getClients({ pageNumber: 1, pageSize: 100 });
    if (initial) {
      form.setFieldsValue({
        ...initial,
        expectedCloseDate: initial.expectedCloseDate ? dayjs(initial.expectedCloseDate) : undefined,
      });
      // load contacts for the pre-selected client
      if (initial.clientId) {
        setLoadingContacts(true);
        instance.get(`/api/contacts/by-client/${initial.clientId}`)
          .then((r) => setContacts(r.data ?? []))
          .catch(() => setContacts([]))
          .finally(() => setLoadingContacts(false));
      }
    } else {
      form.resetFields();
      setContacts([]);
    }
  }, [open, initial]);

  const clients = clientsState.clients?.items ?? [];

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
    onSubmit({ ...values, expectedCloseDate: values.expectedCloseDate?.format("YYYY-MM-DD") });
    form.resetFields();
    setContacts([]);
  };

  return (
    <Modal title={isEdit ? "Edit Opportunity" : "Add Opportunity"} open={open} onCancel={onClose} footer={null} destroyOnHidden width={560}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ stage: 1, source: 1, currency: "ZAR", probability: 30, estimatedValue: 0 }}>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Annual SLA Deal" />
        </Form.Item>

        <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Client is required" }]}>
          <Select showSearch placeholder="Select a client" loading={clientsState.isPending} optionFilterProp="children" onChange={handleClientChange}>
            {clients.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="contactId" label="Contact">
          <Select showSearch placeholder="Select a contact" loading={loadingContacts} optionFilterProp="children" allowClear disabled={contacts.length === 0}>
            {contacts.map((c) => <Option key={c.id} value={c.id}>{c.firstName} {c.lastName}</Option>)}
          </Select>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="estimatedValue" label="Estimated Value">
              <InputNumber style={{ width: "100%" }} min={0} prefix="R" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="currency" label="Currency">
              <Select>
                <Option value="ZAR">ZAR</Option>
                <Option value="USD">USD</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="stage" label="Stage">
              <Select>
                {STAGE_OPTIONS.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="source" label="Source">
              <Select>
                {SOURCE_OPTIONS.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="probability" label="Probability (%)">
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

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            {isEdit ? "Save Changes" : "Create"}
          </Button>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── AI Activity Summary Modal ─────────────────────────────────────────────────
interface AISummaryModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
}

const ACTIVITY_TYPES: Record<number, string> = {
  1: "Meeting", 2: "Call", 3: "Email", 4: "Task", 5: "Presentation", 6: "Other",
};
const ACTIVITY_STATUSES: Record<number, string> = {
  1: "Scheduled", 2: "Completed", 3: "Cancelled",
};

const AISummaryModal = ({ opportunity, open, onClose }: AISummaryModalProps) => {
  const [summary,  setSummary]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open || !opportunity) return;
    setSummary("");
    setError("");
    setLoading(true);

    instance
      .get("/api/activities", {
        params: { relatedToType: 2, relatedToId: opportunity.id, pageSize: 50 },
      })
      .then(async (r) => {
        const activities = r.data?.items ?? [];

        if (activities.length === 0) {
          setSummary("No activities have been logged for this opportunity yet.");
          setLoading(false);
          return;
        }

        const activityLines = activities
          .map((a: any) => {
            const type    = ACTIVITY_TYPES[a.type]    ?? "Activity";
            const status  = ACTIVITY_STATUSES[a.status] ?? "Unknown";
            const date    = a.dueDate ? dayjs(a.dueDate).format("DD MMM YYYY") : "no date";
            const outcome = a.outcome ? ` Outcome: "${a.outcome}"` : "";
            return `- ${type} on ${date} [${status}]: "${a.subject}"${outcome}`;
          })
          .join("\n");

        const prompt = `You are a CRM assistant. Below is a list of sales activities for the opportunity titled "${opportunity.title}" with client "${opportunity.clientName ?? "Unknown"}". The deal is currently at the "${STAGES[opportunity.stage]?.label ?? "Unknown"}" stage with an estimated value of ${formatValue(opportunity.estimatedValue, opportunity.currency)} and ${opportunity.probability ?? 0}% probability.

Activities:
${activityLines}

Write a concise 3–5 sentence summary for a sales manager. Cover: what has happened so far, where the deal currently stands, and any next steps or concerns worth flagging. Be professional and direct.`;

        try {
          const result = await callGemini(prompt);
          setSummary(result);
        } catch {
          setError("Failed to generate summary. Please try again.");
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to load activities.");
        setLoading(false);
      });
  }, [open, opportunity]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Flex justify="flex-end">
          <Button onClick={onClose}>Close</Button>
        </Flex>
      }
      destroyOnHidden
      width={580}
      title={
        <Flex align="center" gap={10}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #707070, #404040)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RobotOutlined style={{ color: "#fff", fontSize: 15 }} />
          </div>
          <Flex vertical gap={1}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 14 }}>
              AI Activity Summary
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
              {opportunity?.title}
            </Text>
          </Flex>
        </Flex>
      }
    >
      {loading ? (
        <Flex vertical align="center" gap={12} style={{ padding: "32px 0" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(112,112,112,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RobotOutlined style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }} />
          </div>
          <Flex vertical align="center" gap={4}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Analysing activities...</Text>
            <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
              Gemini is reviewing the deal history
            </Text>
          </Flex>
        </Flex>
      ) : error ? (
        <Flex align="center" gap={10} style={{
          background: "rgba(255,77,79,0.08)",
          border: "1px solid rgba(255,77,79,0.25)",
          borderRadius: 8, padding: "12px 16px",
        }}>
          <Text style={{ color: "rgba(255,77,79,0.85)" }}>{error}</Text>
        </Flex>
      ) : (
        <Flex vertical gap={12}>
          {/* Context pills */}
          <Flex gap={8} wrap="wrap">
            <Tag color={STAGES[opportunity?.stage ?? 1]?.color} style={{ marginInlineEnd: 0 }}>
              {STAGES[opportunity?.stage ?? 1]?.label}
            </Tag>
            <Tag style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(112,112,112,0.3)", color: "rgba(255,255,255,0.6)", marginInlineEnd: 0 }}>
              {formatValue(opportunity?.estimatedValue, opportunity?.currency)}
            </Tag>
            <Tag style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(112,112,112,0.3)", color: "rgba(255,255,255,0.6)", marginInlineEnd: 0 }}>
              {opportunity?.probability ?? 0}% probability
            </Tag>
          </Flex>

          <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0" }} />

          {/* Summary text */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(112,112,112,0.25)",
            borderRadius: 10,
            padding: "16px 18px",
          }}>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {summary}
            </Text>
          </div>

          <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
            Generated by Gemini 1.5 Flash · Based on logged activities only
          </Text>
        </Flex>
      )}
    </Modal>
  );
};

// ── Pipeline Tab ──────────────────────────────────────────────────────────────
const PipelineTab = ({ styles }: { styles: any }) => {
  const state                 = useOpportunitiesState();
  const { getPipeline }       = useOpportunitiesActions();

  useEffect(() => { getPipeline(); }, []);

  const pipeline = state.pipeline;

  if (!pipeline) return (
    <Flex justify="center" style={{ padding: 48 }}>
      <Text style={{ color: "rgba(255,255,255,0.3)" }}>Loading pipeline...</Text>
    </Flex>
  );

  return (
    <Flex vertical gap={20} style={{ padding: 16 }}>
      {/* Summary row */}
      <Row gutter={16}>
        {[
          { label: "Total Opportunities", value: pipeline.totalOpportunities ?? 0 },
          { label: "Pipeline Value",       value: formatValue(pipeline.totalPipelineValue) },
          { label: "Weighted Value",       value: formatValue(pipeline.weightedPipelineValue) },
          { label: "Win Rate",             value: `${(pipeline.winRate ?? 0).toFixed(1)}%` },
        ].map((stat) => (
          <Col span={6} key={stat.label}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(112,112,112,0.3)", borderRadius: 10, padding: "14px 18px" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", display: "block" }}>{stat.label}</Text>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{stat.value}</Text>
            </div>
          </Col>
        ))}
      </Row>

      <Divider style={{ borderColor: "rgba(112,112,112,0.25)", margin: "4px 0" }} />

      {/* Stage breakdown */}
      <Row gutter={12}>
        {(pipeline.stages ?? []).map((s: any) => (
          <Col span={4} key={s.stage}>
            <Flex vertical gap={10} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(112,112,112,0.3)`, borderRadius: 10, padding: "16px 14px", borderTop: `3px solid ${STAGES[s.stage]?.color === "green" ? "#52c41a" : STAGES[s.stage]?.color === "red" ? "#ff4d4f" : STAGES[s.stage]?.color === "blue" ? "#1677ff" : STAGES[s.stage]?.color === "gold" ? "#faad14" : STAGES[s.stage]?.color === "cyan" ? "#13c2c2" : "#722ed1"}` }}>
              <Tag color={STAGES[s.stage]?.color} style={{ width: "fit-content", marginInlineEnd: 0 }}>
                {STAGES[s.stage]?.label ?? `Stage ${s.stage}`}
              </Tag>
              <Flex vertical gap={4}>
                <Text style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.count}</Text>
                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>opportunities</Text>
              </Flex>
              <Flex vertical gap={2}>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{formatValue(s.totalValue)}</Text>
                <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>total value</Text>
              </Flex>
              {s.weightedValue != null && (
                <Flex vertical gap={2}>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{formatValue(s.weightedValue)}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>weighted</Text>
                </Flex>
              )}
            </Flex>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const OpportunitiesPage = () => {
  const { styles } = useOpportunitiesPageStyles();
  const state      = useOpportunitiesState();
  const {
    getOpportunities, getMyOpportunities,
    createOpportunity, updateOpportunity, moveStage, assignOpportunity, deleteOpportunity,
  } = useOpportunitiesActions();

  const [tab,        setTab]        = useState<TabKey>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize,   setPageSize]   = useState(10);
  const [showCreate,      setShowCreate]      = useState(false);
  const [editTarget,      setEditTarget]      = useState<Opportunity | null>(null);
  const [moveTarget,      setMoveTarget]      = useState<Opportunity | null>(null);
  const [assignTarget,    setAssignTarget]    = useState<Opportunity | null>(null);
  const [historyTarget,   setHistoryTarget]   = useState<string | null>(null);
  const [deleteTarget,    setDeleteTarget]    = useState<string | null>(null);
  const [summarizeTarget, setSummarizeTarget] = useState<Opportunity | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [searchTerm,   setSearchTerm]   = useState("");
  const [stageFilter,  setStageFilter]  = useState<number | undefined>();
  const [clientFilter, setClientFilter] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Role check ────────────────────────────────────────────────────────────
  const [canManage, setCanManage] = useState(false);
  useEffect(() => {
    const role = localStorage.getItem("user_role") ?? "";
    setCanManage(["Admin", "SalesManager"].includes(role));
  }, []);

  // ── Client dropdown for filter ────────────────────────────────────────────
  const clientsState   = useClientsState();
  const { getClients } = useClientsActions();
  useEffect(() => {
    if (!clientsState.clients?.items?.length) getClients({ pageNumber: 1, pageSize: 100 });
  }, []);
  const clientOptions = clientsState.clients?.items ?? [];

  const load = (overrides?: object) => {
    const query = { pageNumber, pageSize, searchTerm: searchTerm || undefined, stage: stageFilter, clientId: clientFilter, ...overrides };
    if (tab === "all")  getOpportunities(query);
    if (tab === "mine") getMyOpportunities({ pageNumber, pageSize, stage: stageFilter });
  };

  useEffect(() => { getOpportunities({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { if (tab !== "pipeline") load(); }, [tab, pageNumber, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      getOpportunities({ pageNumber: 1, pageSize, searchTerm: val || undefined, stage: stageFilter, clientId: clientFilter });
    }, 400);
  };

  const handleStageFilter = (val: number) => {
    setStageFilter(val);
    setPageNumber(1);
    load({ stage: val, pageNumber: 1 });
  };

  const handleClientFilter = (val: string) => {
    setClientFilter(val);
    setPageNumber(1);
    load({ clientId: val, pageNumber: 1 });
  };

  const data       = tab === "mine" ? state.myOpportunities : state.opportunities;
  const items      = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  const handleCreate = async (payload: CreateOpportunityPayload) => {
    await createOpportunity(payload);
    setShowCreate(false);
    load();
  };

  const handleEdit = async (payload: CreateOpportunityPayload) => {
    if (!editTarget) return;
    await updateOpportunity(editTarget.id, payload);
    setEditTarget(null);
    load();
  };

  const handleMoveStage = async (id: string, payload: any) => {
    await moveStage(id, payload);
    setMoveTarget(null);
    load();
  };

  const handleAssign = async (id: string, userId: string) => {
    await assignOpportunity(id, userId);
    setAssignTarget(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteOpportunity(id);
    load();
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
      render: (stage: number) => (
        <Tag color={STAGES[stage]?.color} style={{ marginInlineEnd: 0 }}>
          {STAGES[stage]?.label ?? stage}
        </Tag>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      render: (source: number) => (
        <Text className={styles.cellMuted}>{SOURCES[source] ?? "—"}</Text>
      ),
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{formatValue(v, record.currency)}</Text>
      ),
    },
    {
      title: "Probability",
      dataIndex: "probability",
      render: (v: number) => <Text className={styles.cellMuted}>{v ?? 0}%</Text>,
    },
    {
      title: "Close Date",
      dataIndex: "expectedCloseDate",
      render: (d: string) => {
        const isOverdue = d && dayjs(d).isBefore(dayjs(), "day");
        return (
          <Text style={{ color: isOverdue ? "rgba(255,77,79,0.85)" : "rgba(255,255,255,0.55)" }}>
            {d ? dayjs(d).format("DD MMM YYYY") : "—"}
          </Text>
        );
      },
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      render: (name?: string) => (
        <Text className={name ? styles.cellPrimary : styles.cellMuted}>{name ?? "Unassigned"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_: unknown, record: Opportunity) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => setEditTarget(record),
          },
          {
            key: "move",
            label: "Move Stage",
            icon: <SwapOutlined />,
            onClick: () => setMoveTarget(record),
          },
          {
            key: "history",
            label: "Stage History",
            icon: <HistoryOutlined />,
            onClick: () => setHistoryTarget(record.id),
          },
          {
            key: "ai-summary",
            label: "AI Activity Summary",
            icon: <RobotOutlined />,
            onClick: () => setSummarizeTarget(record),
          },
          ...(canManage ? [
            { type: "divider" as const },
            {
              key: "assign",
              label: "Assign",
              icon: <UserSwitchOutlined />,
              onClick: () => setAssignTarget(record),
            },
            { type: "divider" as const },
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
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
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
      pagination={{
        current: pageNumber,
        pageSize,
        total: totalCount,
        showSizeChanger: true,
        showTotal: (total) => `${total} opportunities`,
        onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
      }}
      locale={{ emptyText: "No opportunities found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Opportunities</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Add Opportunity
        </Button>
      </Flex>

      {/* Filters — hidden on pipeline tab */}
      {tab !== "pipeline" && (
        <Flex gap={12} wrap="wrap">
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
            style={{ width: 220, backgroundColor: "#707070", border: "none", color: "#fff" }}
          />
          <Select
            placeholder="All Stages"
            allowClear
            value={stageFilter}
            onChange={handleStageFilter}
            onClear={() => { setStageFilter(undefined); load({ stage: undefined, pageNumber: 1 }); }}
            style={{ width: 150 }}
          >
            {STAGE_OPTIONS.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
          </Select>
          {tab === "all" && (
            <Select
              placeholder="All Clients"
              showSearch
              allowClear
              value={clientFilter}
              onChange={handleClientFilter}
              onClear={() => { setClientFilter(undefined); load({ clientId: undefined, pageNumber: 1 }); }}
              optionFilterProp="children"
              style={{ width: 180 }}
            >
              {clientOptions.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
          )}
        </Flex>
      )}

      {/* Table / Pipeline */}
      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => { setTab(k as TabKey); setPageNumber(1); setSearchTerm(""); setStageFilter(undefined); setClientFilter(undefined); }}
          items={[
            { key: "all",      label: "All Opportunities", children: <TableContent /> },
            { key: "mine",     label: "My Opportunities",  children: <TableContent /> },
            { key: "pipeline", label: "Pipeline",          children: <PipelineTab styles={styles} /> },
          ]}
        />
      </Card>

      {/* Modals */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      <CreateModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        isPending={state.isPending}
        initial={editTarget}
      />

      <MoveStageModal
        opportunity={moveTarget}
        open={!!moveTarget}
        onClose={() => setMoveTarget(null)}
        onSubmit={handleMoveStage}
        isPending={state.isPending}
      />

      <AssignModal
        opportunity={assignTarget}
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssign}
        isPending={state.isPending}
      />

      <StageHistoryModal
        opportunityId={historyTarget}
        open={!!historyTarget}
        onClose={() => setHistoryTarget(null)}
      />

      <AISummaryModal
        opportunity={summarizeTarget}
        open={!!summarizeTarget}
        onClose={() => setSummarizeTarget(null)}
      />

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={async () => { await handleDelete(deleteTarget!); setDeleteTarget(null); }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        title="Delete Opportunity"
        width={400}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Are you sure you want to delete this opportunity? This action cannot be undone.
        </Text>
      </Modal>

    </Flex>
  );
};

export default OpportunitiesPage;