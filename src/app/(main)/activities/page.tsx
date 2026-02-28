"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, InputNumber, Modal, Popconfirm,
  Row, Select, Table, Tag, Tabs, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, CheckOutlined, StopOutlined, DeleteOutlined,
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

// ── Complete Modal ────────────────────────────────────────────────────────────
interface ICompleteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ICompleteActivityPayload) => void;
  isPending: boolean;
}

const CompleteModal = ({ open, onClose, onSubmit, isPending }: ICompleteModalProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({ outcome: values.outcome });
    form.resetFields();
  };

  return (
    <Modal title="Complete Activity" open={open} onCancel={onClose} footer={null} destroyOnHidden width={440}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="outcome"
          label="Outcome"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>What was the result of this activity?</Text>}
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
interface ICreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ICreateActivityPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: ICreateModalProps) => {
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

  const handleRelatedTypeChange = (type: number) => {
    setRelatedType(type);
    form.setFieldValue("relatedToId", undefined);
  };

  const handleFinish = (values: any) => {
    onSubmit({
      type:          values.type,
      subject:       values.subject,
      description:   values.description,
      priority:      values.priority,
      dueDate:       values.dueDate?.toISOString(),
      duration:      values.duration,
      location:      values.location,
      assignedToId:  values.assignedToId,
      relatedToType: values.relatedToType,
      relatedToId:   values.relatedToId,
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
              <Select
                showSearch
                placeholder="Assign to team member"
                loading={usersState.isPending}
                optionFilterProp="children"
                allowClear
              >
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
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Which entity does this relate to?</Text>}
            >
              <Select placeholder="Select entity type" allowClear onChange={handleRelatedTypeChange}>
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
  const [pageSize,       setPageSize]       = useState(10);
  const [typeFilter,     setTypeFilter]     = useState<number | undefined>();
  const [statusFilter,   setStatusFilter]   = useState<number | undefined>();
  const [showCreate,     setShowCreate]     = useState(false);
  const [showComplete,   setShowComplete]   = useState(false);
  const [completeTarget, setCompleteTarget] = useState<string | null>(null);

  const load = (t = tab, p = pageNumber, ps = pageSize) => {
    if (t === "all")      getActivities({ pageNumber: p, pageSize: ps, type: typeFilter, status: statusFilter });
    if (t === "mine")     getMyActivities({ pageNumber: p, pageSize: ps });
    if (t === "upcoming") getUpcomingActivities(7);
    if (t === "overdue")  getOverdueActivities();
  };

  useEffect(() => { getActivities({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { load(); }, [tab, pageNumber, pageSize, typeFilter, statusFilter]);

  const data = useMemo(() => {
    if (tab === "mine")     return state.myActivities;
    if (tab === "upcoming") return state.upcomingActivities;
    if (tab === "overdue")  return state.overdueActivities;
    return state.activities;
  }, [tab, state]);

  const items      = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  const handleCreate = async (payload: ICreateActivityPayload) => {
    await createActivity(payload);
    setShowCreate(false);
    load();
  };

  const handleCompleteClick = (id: string) => {
    setCompleteTarget(id);
    setShowComplete(true);
  };

  const handleComplete = async (payload: ICompleteActivityPayload) => {
    if (!completeTarget) return;
    await completeActivity(completeTarget, payload);
    setShowComplete(false);
    setCompleteTarget(null);
    load();
  };

  const handleCancel = async (id: string) => { await cancelActivity(id); load(); };
  const handleDelete = async (id: string) => { await deleteActivity(id); load(); };

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
      render: (_: unknown, record: IActivity) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          {record.status === 1 && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", boxShadow: "none" }}
              onClick={() => handleCompleteClick(record.id)}
            >
              Complete
            </Button>
          )}

          {record.status === 1 && (
            <Popconfirm
              title="Cancel this activity?"
              okText="Cancel Activity"
              cancelText="No"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleCancel(record.id)}
            >
              <Button size="small" icon={<StopOutlined />} danger style={{ boxShadow: "none" }}>
                Cancel
              </Button>
            </Popconfirm>
          )}

          {(record.status === 2 || record.status === 3) && (
            <Popconfirm
              title="Delete this activity?"
              okText="Delete"
              cancelText="No"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} style={{ boxShadow: "none" }}>
                Delete
              </Button>
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
      pagination={{
        current: pageNumber,
        pageSize,
        total: totalCount,
        showSizeChanger: true,
        showTotal: (total) => `${total} activities`,
        onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
      }}
      locale={{ emptyText: "No activities found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Activities</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Log Activity
        </Button>
      </Flex>

      {tab === "all" && (
        <Flex gap={12}>
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
        </Flex>
      )}

      <Card className={styles.card} variant="outlined" style={{ width: "100%" }}>
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => { setTab(k as TabKey); setPageNumber(1); setTypeFilter(undefined); setStatusFilter(undefined); }}
          items={[
            { key: "all",      label: "All Activities", children: <TableContent /> },
            { key: "mine",     label: "My Activities",  children: <TableContent /> },
            { key: "upcoming", label: "Upcoming",       children: <TableContent /> },
            { key: "overdue",  label: "Overdue",        children: <TableContent /> },
          ]}
        />
      </Card>

      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      <CompleteModal
        open={showComplete}
        onClose={() => { setShowComplete(false); setCompleteTarget(null); }}
        onSubmit={handleComplete}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default ActivitiesPage;