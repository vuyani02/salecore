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
import { useActivitiesPageStyles } from "./styeles/Activitiesstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type { Activity, CreateActivityPayload } from "@/providers/activitiesProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Constants ─────────────────────────────────────────────────────────────────
// ActivityType:   1=Meeting, 2=Call, 3=Email, 4=Task, 5=Presentation, 6=Other
// ActivityStatus: 1=Scheduled, 2=Completed, 3=Cancelled
// RelatedToType:  1=Client, 2=Opportunity, 3=Proposal, 4=Contract

const ACTIVITY_TYPE: Record<number, { label: string; color: string }> = {
  1: { label: "Meeting",      color: "blue"    },
  2: { label: "Call",         color: "cyan"    },
  3: { label: "Email",        color: "purple"  },
  4: { label: "Task",         color: "gold"    },
  5: { label: "Presentation", color: "orange"  },
  6: { label: "Other",        color: "default" },
};

const ACTIVITY_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Scheduled",  color: "blue"    },
  2: { label: "Completed",  color: "green"   },
  3: { label: "Cancelled",  color: "default" },
};

const RELATED_TO_TYPES = [
  { value: 1, label: "Client"      },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal"    },
  { value: 4, label: "Contract"    },
];

const TYPE_OPTIONS = Object.entries(ACTIVITY_TYPE).map(([k, v]) => ({ value: Number(k), label: v.label }));

type TabKey = "all" | "mine" | "upcoming" | "overdue";

interface RelatedOption { id: string; name?: string; title?: string; }
interface UserOption    { id: string; fullName: string; }

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateActivityPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form]           = Form.useForm();
  const [users,          setUsers]          = useState<UserOption[]>([]);
  const [relatedOptions, setRelatedOptions] = useState<RelatedOption[]>([]);
  const [loadingUsers,   setLoadingUsers]   = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedType,    setRelatedType]    = useState<number | undefined>();
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    instance.get("/api/users", { params: { isActive: true, pageSize: 100 } })
      .then((r) => setUsers(r.data?.items ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [open]);

  const handleRelatedTypeChange = async (type: number) => {
    setRelatedType(type);
    form.setFieldValue("relatedToId", undefined);
    setRelatedOptions([]);
    if (!type) return;

    const endpointMap: Record<number, string> = {
      1: "/api/clients",
      2: "/api/opportunities",
      3: "/api/proposals",
      4: "/api/contracts",
    };

    const endpoint = endpointMap[type];
    if (!endpoint) return;

    setLoadingRelated(true);
    try {
      const r = await instance.get(endpoint, { params: { pageNumber: 1, pageSize: 100 } });
      setRelatedOptions(r.data?.items ?? []);
    } catch {
      setRelatedOptions([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleFinish = (values: any) => {
    onSubmit({
      title:          values.title,
      description:    values.description,
      activityType:   values.activityType,
      scheduledAt:    values.scheduledAt?.toISOString(),
      durationMinutes: values.durationMinutes,
      assignedToId:   values.assignedToId,
      relatedToType:  values.relatedToType,
      relatedToId:    values.relatedToId,
    });
    form.resetFields();
    setRelatedType(undefined);
    setRelatedOptions([]);
  };

  return (
    <Modal title="Log Activity" open={open} onCancel={onClose} footer={null} destroyOnClose width={560}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ activityType: 1 }}>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Intro call with Acme Corp" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="activityType" label="Type" rules={[{ required: true }]}>
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
            <Form.Item name="scheduledAt" label="Scheduled At">
              <DatePicker showTime style={{ width: "100%" }} placeholder="Select date & time" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="durationMinutes"
              label="Duration (minutes)"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>How long did/will this take?</Text>}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 30" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="assignedToId" label="Assign To">
              <Select showSearch placeholder="Assign to team member" loading={loadingUsers} optionFilterProp="children" allowClear>
                {users.map((u) => <Option key={u.id} value={u.id}>{u.fullName}</Option>)}
              </Select>
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
                loading={loadingRelated}
                optionFilterProp="children"
                allowClear
                disabled={!relatedType}
              >
                {relatedOptions.map((o) => (
                  <Option key={o.id} value={o.id}>{o.name ?? o.title ?? o.id}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Notes">
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

  const [tab,          setTab]          = useState<TabKey>("all");
  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [typeFilter,   setTypeFilter]   = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [showCreate,   setShowCreate]   = useState(false);

  const load = (t = tab, p = pageNumber, ps = pageSize) => {
    const query = { pageNumber: p, pageSize: ps, activityType: typeFilter, status: statusFilter };
    if (t === "all")      getActivities(query);
    if (t === "mine")     getMyActivities({ pageNumber: p, pageSize: ps });
    if (t === "upcoming") getUpcomingActivities({ pageNumber: p, pageSize: ps });
    if (t === "overdue")  getOverdueActivities({ pageNumber: p, pageSize: ps });
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

  const handleCreate = async (payload: CreateActivityPayload) => {
    await createActivity(payload);
    setShowCreate(false);
    load();
  };

  const handleComplete = async (id: string) => { await completeActivity(id); load(); };
  const handleCancel   = async (id: string) => { await cancelActivity(id);   load(); };
  const handleDelete   = async (id: string) => { await deleteActivity(id);   load(); };

  const columns: ColumnsType<Activity> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          {record.relatedToName && (
            <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.relatedToName}</Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Type",
      dataIndex: "activityType",
      render: (type: number) => {
        const t = ACTIVITY_TYPE[type];
        return t ? <Tag color={t.color} style={{ marginInlineEnd: 0 }}>{t.label}</Tag> : <Tag>—</Tag>;
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
      title: "Scheduled At",
      dataIndex: "scheduledAt",
      render: (d?: string) => (
        <Text className={styles.cellMuted}>
          {d ? dayjs(d).format("DD MMM YYYY HH:mm") : "—"}
        </Text>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationMinutes",
      render: (v?: number) => (
        <Text className={styles.cellMuted}>{v ? `${v} min` : "—"}</Text>
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
      render: (_: unknown, record: Activity) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          {/* Complete — Scheduled only */}
          {record.status === 1 && (
            <Popconfirm title="Mark this activity as complete?" okText="Complete" cancelText="Cancel" onConfirm={() => handleComplete(record.id)}>
              <Button
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", boxShadow: "none" }}
              >
                Complete
              </Button>
            </Popconfirm>
          )}

          {/* Cancel — Scheduled only */}
          {record.status === 1 && (
            <Popconfirm title="Cancel this activity?" okText="Cancel Activity" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => handleCancel(record.id)}>
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

          {/* Delete — Completed or Cancelled */}
          {(record.status === 2 || record.status === 3) && (
            <Popconfirm title="Delete this activity?" okText="Delete" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
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

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Activities</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Log Activity
        </Button>
      </Flex>

      {/* Filters — All tab only */}
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

      {/* Table card */}
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

      {/* Create Modal */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default ActivitiesPage;