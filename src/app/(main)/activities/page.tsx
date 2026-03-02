"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Card, Col, DatePicker, Descriptions, Divider, Dropdown,
  Flex, Form, Input, InputNumber, Modal, Row, Select,
  Table, Tag, Tabs, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, CheckOutlined, StopOutlined, DeleteOutlined,
  MoreOutlined, EyeOutlined, SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useActivitiesState, useActivitiesActions } from "@/providers/activitiesProvider";
import { useUsersState, useUsersActions } from "@/providers/usersProvider";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunitiesProvider";
import { useActivitiesPageStyles } from "./styeles/Activitiesstyles";
import type {
  IActivity,
  ICreateActivityPayload,
  ICompleteActivityPayload,
} from "@/providers/activitiesProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Constants ─────────────────────────────────────────────────────────────────
const ACTIVITY_TYPE: Record<number, { label: string; color: string }> = {
  1: { label: "Meeting",      color: "blue"    },
  2: { label: "Call",         color: "cyan"    },
  3: { label: "Email",        color: "purple"  },
  4: { label: "Task",         color: "gold"    },
  5: { label: "Presentation", color: "orange"  },
  6: { label: "Other",        color: "default" },
};

const ACTIVITY_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Scheduled", color: "blue"    },
  2: { label: "Completed", color: "green"   },
  3: { label: "Cancelled", color: "default" },
};

const PRIORITY: Record<number, { label: string; color: string }> = {
  1: { label: "Low",    color: "default" },
  2: { label: "Medium", color: "gold"    },
  3: { label: "High",   color: "orange"  },
  4: { label: "Urgent", color: "red"     },
};

const RELATED_TO_TYPES = [
  { value: 1, label: "Client"      },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal"    },
  { value: 4, label: "Contract"    },
];

const TYPE_OPTIONS = Object.entries(ACTIVITY_TYPE).map(([k, v]) => ({ value: Number(k), label: v.label }));

type TabKey = "all" | "mine" | "upcoming" | "overdue";

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ activity, open, onClose }: {
  activity: IActivity | null; open: boolean; onClose: () => void;
}) => {
  if (!activity) return null;
  const type     = ACTIVITY_TYPE[activity.type];
  const status   = ACTIVITY_STATUS[activity.status];
  const priority = activity.priority ? PRIORITY[activity.priority] : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Flex justify="flex-end"><Button onClick={onClose}>Close</Button></Flex>}
      destroyOnHidden
      width={560}
      title={
        <Flex vertical gap={6}>
          <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 700 }}>{activity.subject}</Text>
          <Flex gap={6} wrap="wrap">
            {type     && <Tag color={type.color}     style={{ marginInlineEnd: 0 }}>{type.label}</Tag>}
            {status   && <Tag color={status.color}   style={{ marginInlineEnd: 0 }}>{status.label}</Tag>}
            {priority && <Tag color={priority.color} style={{ marginInlineEnd: 0 }}>{priority.label}</Tag>}
          </Flex>
        </Flex>
      }
    >
      <Descriptions
        column={2}
        size="small"
        style={{ marginTop: 8 }}
        labelStyle={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}
        contentStyle={{ color: "rgba(0,0,0,0.85)", fontSize: 13, fontWeight: 600 }}
      >
        <Descriptions.Item label="Due Date">
          {activity.dueDate ? dayjs(activity.dueDate).format("DD MMM YYYY HH:mm") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Duration">
          {activity.duration ? `${activity.duration} min` : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Assigned To">{activity.assignedToName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Location">{activity.location ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Related To" span={2}>{activity.relatedToName ?? "—"}</Descriptions.Item>
      </Descriptions>

      {activity.description && (
        <>
          <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "12px 0" }} />
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Description
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.7)", fontSize: 13 }}>{activity.description}</Text>
        </>
      )}

      {activity.outcome && (
        <>
          <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "12px 0" }} />
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Outcome
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.7)", fontSize: 13 }}>{activity.outcome}</Text>
        </>
      )}
    </Modal>
  );
};

// ── Complete Modal ────────────────────────────────────────────────────────────
const CompleteModal = ({ open, onClose, onSubmit, isPending }: {
  open: boolean; onClose: () => void;
  onSubmit: (payload: ICompleteActivityPayload) => void;
  isPending: boolean;
}) => {
  const [form] = Form.useForm();

  useEffect(() => { if (!open) form.resetFields(); }, [open]);

  return (
    <Modal title="Complete Activity" open={open} onCancel={onClose} footer={null} destroyOnHidden width={440}>
      <Form form={form} layout="vertical" onFinish={(v) => { onSubmit({ outcome: v.outcome }); form.resetFields(); }}>
        <Form.Item
          name="outcome"
          label="Outcome"
          extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>What was the result of this activity?</Text>}
        >
          <TextArea rows={3} placeholder="e.g. Client confirmed interest. Follow-up scheduled." />
        </Form.Item>
        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Mark Complete
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Create Modal ──────────────────────────────────────────────────────────────
const CreateModal = ({ open, onClose, onSubmit, isPending }: {
  open: boolean; onClose: () => void;
  onSubmit: (payload: ICreateActivityPayload) => void;
  isPending: boolean;
}) => {
  const [form]        = Form.useForm();
  const [relatedType, setRelatedType] = useState<number | undefined>();

  const usersState           = useUsersState();
  const { getUsers }         = useUsersActions();
  const clientsState         = useClientsState();
  const { getClients }       = useClientsActions();
  const oppsState            = useOpportunitiesState();
  const { getOpportunities } = useOpportunitiesActions();

  useEffect(() => {
    if (!open) return;
    if (!usersState.users?.items?.length) getUsers({ isActive: true, pageSize: 100 });
  }, [open]);

  useEffect(() => {
    if (!relatedType) return;
    if (relatedType === 1 && !clientsState.clients?.items?.length)
      getClients({ pageNumber: 1, pageSize: 100 });
    if (relatedType === 2 && !oppsState.opportunities?.items?.length)
      getOpportunities({ pageNumber: 1, pageSize: 100 });
  }, [relatedType]);

  const users         = usersState.users?.items ?? [];
  const clients       = clientsState.clients?.items ?? [];
  const opportunities = oppsState.opportunities?.items ?? [];

  const relatedOptions = useMemo(() => {
    if (relatedType === 1) return clients.map((c)      => ({ id: c.id, label: c.name }));
    if (relatedType === 2) return opportunities.map((o) => ({ id: o.id, label: o.title }));
    return [];
  }, [relatedType, clients, opportunities]);

  const handleFinish = (values: any) => {
    onSubmit({
      type:          values.type,
      subject:       values.subject,
      description:   values.description,
      priority:      values.priority,
      dueDate:       values.dueDate?.toISOString(),
      duration:      values.duration,
      location:      values.location,
      assignedToId:  values.assignedToId  || undefined,
      relatedToType: values.relatedToType || undefined,
      relatedToId:   values.relatedToId   || undefined,
    });
    form.resetFields();
    setRelatedType(undefined);
  };

  return (
    <Modal title="Log Activity" open={open} onCancel={onClose} footer={null} destroyOnHidden width={580}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ type: 1, priority: 2 }}>

        <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Subject is required" }]}>
          <Input placeholder="e.g. Intro call with Acme Corp" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Select type">
                {TYPE_OPTIONS.map((t) => (
                  <Option key={t.value} value={t.value}>
                    <Tag color={ACTIVITY_TYPE[t.value].color} style={{ marginInlineEnd: 6 }}>{t.label}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="priority" label="Priority">
              <Select placeholder="Select priority">
                {Object.entries(PRIORITY).map(([k, v]) => (
                  <Option key={k} value={Number(k)}>
                    <Tag color={v.color} style={{ marginInlineEnd: 6 }}>{v.label}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker showTime style={{ width: "100%" }} placeholder="Select date & time" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="duration" label="Duration (minutes)">
              <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 60" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="assignedToId" label="Assign To">
              <Select showSearch placeholder="Assign to team member" loading={usersState.isPending} optionFilterProp="children" allowClear>
                {users.map((u) => <Option key={u.id} value={u.id}>{u.fullName}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="Location">
              <Input placeholder="e.g. Microsoft Teams" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="relatedToType"
              label="Link To"
              extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>Which entity does this relate to?</Text>}
            >
              <Select placeholder="Select entity type" allowClear onChange={(v) => { setRelatedType(v); form.setFieldValue("relatedToId", undefined); }}>
                {RELATED_TO_TYPES.map((r) => <Option key={r.value} value={r.value}>{r.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="relatedToId" label="Select Record">
              <Select
                showSearch
                placeholder={relatedType ? "Select a record" : "Select entity type first"}
                loading={clientsState.isPending || oppsState.isPending}
                optionFilterProp="children"
                allowClear
                disabled={!relatedType}
              >
                {relatedOptions.map((o) => <Option key={o.id} value={o.id}>{o.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Any notes about this activity..." />
        </Form.Item>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
          >
            Log Activity
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ActivitiesPage = () => {
  const { styles } = useActivitiesPageStyles();
  const state = useActivitiesState();
  const {
    getActivities, getMyActivities, getUpcomingActivities, getOverdueActivities,
    createActivity, completeActivity, cancelActivity, deleteActivity,
  } = useActivitiesActions();

  const [tab,            setTab]            = useState<TabKey>("all");
  const [pageNumber,     setPageNumber]     = useState(1);
  const [pageSize,       setPageSize]       = useState(6);
  const [typeFilter,     setTypeFilter]     = useState<number | undefined>();
  const [statusFilter,   setStatusFilter]   = useState<number | undefined>();
  const [searchTerm,     setSearchTerm]     = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showCreate,     setShowCreate]     = useState(false);
  const [showComplete,   setShowComplete]   = useState(false);
  const [completeTarget, setCompleteTarget] = useState<string | null>(null);
  const [viewTarget,     setViewTarget]     = useState<IActivity | null>(null);
  const [cancelTarget,   setCancelTarget]   = useState<string | null>(null);
  const [deleteTarget,   setDeleteTarget]   = useState<string | null>(null);

  const load = (t = tab, p = pageNumber, ps = pageSize) => {
    if (t === "all")      getActivities({ pageNumber: p, pageSize: ps, type: typeFilter, status: statusFilter });
    if (t === "mine")     getMyActivities({ pageNumber: p, pageSize: ps });
    if (t === "upcoming") getUpcomingActivities(7);
    if (t === "overdue")  getOverdueActivities();
  };

  useEffect(() => { getActivities({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { load(); }, [tab, pageNumber, pageSize, typeFilter, statusFilter]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (tab === "all") getActivities({ pageNumber: 1, pageSize, type: typeFilter, status: statusFilter });
    }, 400);
  };

  const data = useMemo(() => {
    if (tab === "mine")     return state.myActivities;
    if (tab === "upcoming") return state.upcomingActivities;
    if (tab === "overdue")  return state.overdueActivities;
    return state.activities;
  }, [tab, state]);

  const allItems   = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  // Client-side search filter
  const items = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    const q = searchTerm.toLowerCase();
    return allItems.filter((a) =>
      a.subject?.toLowerCase().includes(q) ||
      a.assignedToName?.toLowerCase().includes(q) ||
      a.relatedToName?.toLowerCase().includes(q)
    );
  }, [allItems, searchTerm]);

  const handleCreate = async (payload: ICreateActivityPayload) => {
    await createActivity(payload);
    setShowCreate(false);
    load();
  };

  const handleComplete = async (payload: ICompleteActivityPayload) => {
    if (!completeTarget) return;
    await completeActivity(completeTarget, payload);
    setShowComplete(false);
    setCompleteTarget(null);
    load();
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    await cancelActivity(cancelTarget);
    setCancelTarget(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteActivity(deleteTarget);
    setDeleteTarget(null);
    load();
  };

  const columns: ColumnsType<IActivity> = [
    {
      title: "Subject",
      dataIndex: "subject",
      render: (subject: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{subject}</Text>
          {record.relatedToName && (
            <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.relatedToName}</Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: number) => {
        const t = ACTIVITY_TYPE[type];
        return t ? <Tag color={t.color} style={{ marginInlineEnd: 0 }}>{t.label}</Tag> : <Tag>—</Tag>;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority?: number) => {
        if (!priority) return <Text className={styles.cellMuted}>—</Text>;
        const p = PRIORITY[priority];
        return p ? <Tag color={p.color} style={{ marginInlineEnd: 0 }}>{p.label}</Tag> : <Tag>—</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        const s = ACTIVITY_STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>—</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (d?: string) => (
        <Text className={styles.cellMuted}>
          {d ? dayjs(d).format("DD MMM YYYY HH:mm") : "—"}
        </Text>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      render: (name?: string) => (
        <Text className={name ? styles.cellPrimary : styles.cellMuted}>{name ?? "—"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_: unknown, record: IActivity) => {
        const menuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => setViewTarget(record),
          },

          // Complete — Scheduled only
          ...(record.status === 1 ? [
            { type: "divider" as const },
            {
              key: "complete",
              label: "Mark Complete",
              icon: <CheckOutlined />,
              onClick: () => { setCompleteTarget(record.id); setShowComplete(true); },
            },
            {
              key: "cancel",
              label: "Cancel Activity",
              icon: <StopOutlined />,
              danger: true,
              onClick: () => setCancelTarget(record.id),
            },
          ] : []),

          // Delete — Completed or Cancelled only
          ...(record.status === 2 || record.status === 3 ? [
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
        tab === "upcoming" || tab === "overdue" ? false : {
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          showTotal: (total) => `${total} activities`,
          onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
        }
      }
      locale={{ emptyText: "No activities found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Activities</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Log Activity
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={12} wrap="wrap">
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
          placeholder="Search by subject, assignee..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
          style={{ width: 240 }}
        />
        {tab === "all" && (
          <>
            <Select
              className={styles.filterSelect}
              placeholder="All Types"
              allowClear
              value={typeFilter}
              onChange={(v) => { setTypeFilter(v); setPageNumber(1); }}
              style={{ minWidth: 150 }}
            >
              {TYPE_OPTIONS.map((t) => <Option key={t.value} value={t.value}>{t.label}</Option>)}
            </Select>
            <Select
              className={styles.filterSelect}
              placeholder="All Statuses"
              allowClear
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPageNumber(1); }}
              style={{ minWidth: 150 }}
            >
              {Object.entries(ACTIVITY_STATUS).map(([k, v]) => (
                <Option key={k} value={Number(k)}>{v.label}</Option>
              ))}
            </Select>
          </>
        )}
      </Flex>

      {/* Table card */}
      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => {
            setTab(k as TabKey);
            setPageNumber(1);
            setTypeFilter(undefined);
            setStatusFilter(undefined);
            setSearchTerm("");
          }}
          items={[
            { key: "all",      label: "All Activities", children: <TableContent /> },
            { key: "mine",     label: "My Activities",  children: <TableContent /> },
            { key: "upcoming", label: "Upcoming",       children: <TableContent /> },
            { key: "overdue",  label: "Overdue",        children: <TableContent /> },
          ]}
        />
      </Card>

      {/* View Modal */}
      <ViewModal activity={viewTarget} open={!!viewTarget} onClose={() => setViewTarget(null)} />

      {/* Create */}
      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} isPending={state.isPending} />

      {/* Complete */}
      <CompleteModal
        open={showComplete}
        onClose={() => { setShowComplete(false); setCompleteTarget(null); }}
        onSubmit={handleComplete}
        isPending={state.isPending}
      />

      {/* Cancel confirmation */}
      <Modal
        open={!!cancelTarget}
        onCancel={() => setCancelTarget(null)}
        onOk={handleCancel}
        okText="Cancel Activity"
        okButtonProps={{ danger: true, loading: state.isPending }}
        title="Cancel Activity"
        width={420}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to cancel this activity?
        </Text>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: state.isPending }}
        title="Delete Activity"
        width={420}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to permanently delete this activity?
        </Text>
      </Modal>

    </Flex>
  );
};

export default ActivitiesPage;