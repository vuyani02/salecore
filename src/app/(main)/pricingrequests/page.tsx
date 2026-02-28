"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, DatePicker, Flex, Form,
  Input, Modal, Popconfirm, Row, Select,
  Table, Tag, Tabs, Tooltip, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, UserAddOutlined, CheckOutlined, DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  usePricingRequestsState,
  usePricingRequestsActions,
} from "@/providers/pricingRequestsProvider";
import { usePricingRequestsPageStyles } from "./styeles/Pricingrequestsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type {
  PricingRequest,
  CreatePricingRequestPayload,
  AssignPricingRequestPayload,
} from "@/providers/pricingRequestsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Pending",     color: "default" },
  2: { label: "In Progress", color: "blue"    },
  3: { label: "Completed",   color: "green"   },
};

const PRIORITY: Record<number, { label: string; color: string }> = {
  1: { label: "Low",    color: "default" },
  2: { label: "Medium", color: "gold"    },
  3: { label: "High",   color: "orange"  },
  4: { label: "Urgent", color: "red"     },
};

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low"    },
  { value: 2, label: "Medium" },
  { value: 3, label: "High"   },
  { value: 4, label: "Urgent" },
];

const canManage = () => {
  try {
    const roles = JSON.parse(localStorage.getItem("roles") ?? "[]") as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch {
    return false;
  }
};

interface OpportunityOption { id: string; title: string; }
interface UserOption        { id: string; fullName: string; }
type TabKey = "all" | "mine" | "pending";

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePricingRequestPayload) => void;
  isPending: boolean;
}

const CreateModal = ({ open, onClose, onSubmit, isPending }: CreateModalProps) => {
  const [form]          = Form.useForm();
  const [opportunities, setOpportunities] = useState<OpportunityOption[]>([]);
  const [users,         setUsers]         = useState<UserOption[]>([]);
  const [loadingOpp,    setLoadingOpp]    = useState(false);
  const [loadingUsers,  setLoadingUsers]  = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoadingOpp(true);
    instance.get("/api/opportunities", { params: { pageNumber: 1, pageSize: 100 } })
      .then((r) => setOpportunities(r.data?.items ?? []))
      .catch(() => setOpportunities([]))
      .finally(() => setLoadingOpp(false));

    setLoadingUsers(true);
    instance.get("/api/users", { params: { isActive: true, pageSize: 100 } })
      .then((r) => setUsers(r.data?.items ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [open]);

  const handleFinish = (values: any) => {
    onSubmit({
      opportunityId:  values.opportunityId,
      title:          values.title,
      description:    values.description,
      assignedToId:   values.assignedToId,
      priority:       values.priority,
      requiredByDate: values.requiredByDate?.toISOString(),
    });
    form.resetFields();
  };

  return (
    <Modal title="Create Pricing Request" open={open} onCancel={onClose} footer={null} destroyOnHidden width={560}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ priority: 2 }}>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Custom pricing for Client X" />
        </Form.Item>

        <Form.Item
          name="opportunityId"
          label="Linked Opportunity"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Which deal does this pricing request belong to?</Text>}
        >
          <Select showSearch placeholder="Select an opportunity (optional)" loading={loadingOpp} optionFilterProp="children" allowClear>
            {opportunities.map((o) => <Option key={o.id} value={o.id}>{o.title}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Describe what pricing analysis is needed..." />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="priority" label="Priority" rules={[{ required: true, message: "Priority is required" }]}>
              <Select placeholder="Select priority">
                {PRIORITY_OPTIONS.map((p) => (
                  <Option key={p.value} value={p.value}>
                    <Tag color={PRIORITY[p.value].color} style={{ marginInlineEnd: 6 }}>{p.label}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="requiredByDate"
              label="Required By"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Deadline for this request</Text>}
            >
              <DatePicker style={{ width: "100%" }} disabledDate={(d) => d && d.isBefore(dayjs(), "day")} placeholder="Select deadline" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="assignedToId"
          label="Assign To"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Assigning will set status to In Progress automatically</Text>}
        >
          <Select showSearch placeholder="Assign to a team member (optional)" loading={loadingUsers} optionFilterProp="children" allowClear>
            {users.map((u) => <Option key={u.id} value={u.id}>{u.fullName}</Option>)}
          </Select>
        </Form.Item>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" loading={isPending} style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}>
            Create Request
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Assign Modal ──────────────────────────────────────────────────────────────
interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AssignPricingRequestPayload) => void;
  isPending: boolean;
}

const AssignModal = ({ open, onClose, onSubmit, isPending }: AssignModalProps) => {
  const [form]         = Form.useForm();
  const [users,        setUsers]        = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const instance = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    instance.get("/api/users", { params: { isActive: true, pageSize: 100 } })
      .then((r) => setUsers(r.data?.items ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [open]);

  const handleFinish = (values: any) => {
    onSubmit({ userId: values.userId });
    form.resetFields();
  };

  return (
    <Modal title="Assign Pricing Request" open={open} onCancel={onClose} footer={null} destroyOnHidden width={400}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="userId"
          label="Assign To"
          rules={[{ required: true, message: "Please select a team member" }]}
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Status will change to In Progress once assigned</Text>}
        >
          <Select showSearch placeholder="Select a team member" loading={loadingUsers} optionFilterProp="children">
            {users.map((u) => <Option key={u.id} value={u.id}>{u.fullName}</Option>)}
          </Select>
        </Form.Item>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" loading={isPending} style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}>
            Assign
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const PricingRequestsPage = () => {
  const { styles } = usePricingRequestsPageStyles();
  const state = usePricingRequestsState();
  const {
    getPricingRequests, getMyRequests, getPendingRequests,
    createPricingRequest, assignPricingRequest, completePricingRequest,
    deletePricingRequest,
  } = usePricingRequestsActions();

  const [tab,            setTab]            = useState<TabKey>("all");
  const [pageNumber,     setPageNumber]     = useState(1);
  const [pageSize,       setPageSize]       = useState(10);
  const [statusFilter,   setStatusFilter]   = useState<number | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<number | undefined>();
  const [showCreate,     setShowCreate]     = useState(false);
  const [showAssign,     setShowAssign]     = useState(false);
  const [assignTarget,   setAssignTarget]   = useState<string | null>(null);

  const load = (t = tab, p = pageNumber, ps = pageSize) => {
    const query = { pageNumber: p, pageSize: ps, status: statusFilter, priority: priorityFilter };
    if (t === "all")     getPricingRequests(query);
    if (t === "mine")    getMyRequests({ pageNumber: p, pageSize: ps });
    if (t === "pending") getPendingRequests({ pageNumber: p, pageSize: ps });
  };

  useEffect(() => { getPricingRequests({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { load(); }, [tab, pageNumber, pageSize, statusFilter, priorityFilter]);

  const data = useMemo(() => {
    if (tab === "mine")    return state.myRequests;
    if (tab === "pending") return state.pendingRequests;
    return state.pricingRequests;
  }, [tab, state]);

  const items      = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;

  const handleCreate = async (payload: CreatePricingRequestPayload) => {
    await createPricingRequest(payload);
    setShowCreate(false);
    load();
  };

  const handleAssignClick = (id: string) => { setAssignTarget(id); setShowAssign(true); };

  const handleAssign = async (payload: AssignPricingRequestPayload) => {
    if (!assignTarget) return;
    await assignPricingRequest(assignTarget, payload);
    setShowAssign(false);
    setAssignTarget(null);
    load();
  };

  const handleComplete = async (id: string) => { await completePricingRequest(id); load(); };
  const handleDelete   = async (id: string) => { await deletePricingRequest(id);   load(); };

  const columns: ColumnsType<PricingRequest> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          {record.opportunityTitle && (
            <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.opportunityTitle}</Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        const s = STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority: number) => {
        const p = PRIORITY[priority];
        return p ? <Tag color={p.color} style={{ marginInlineEnd: 0 }}>{p.label}</Tag> : <Tag>—</Tag>;
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      render: (name?: string) => (
        <Text className={name ? styles.cellPrimary : styles.cellMuted}>{name ?? "Unassigned"}</Text>
      ),
    },
    {
      title: "Required By",
      dataIndex: "requiredByDate",
      render: (d?: string) => (
        <Text className={styles.cellMuted}>{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "Requested By",
      dataIndex: "requestedByName",
      render: (name?: string) => (
        <Text className={styles.cellMuted}>{name ?? "—"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: PricingRequest) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          {record.status === 1 && canManage() && (
            <Tooltip title="Assign to team member">
              <Button
                size="small"
                icon={<UserAddOutlined />}
                style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
                onClick={() => handleAssignClick(record.id)}
              >
                Assign
              </Button>
            </Tooltip>
          )}
          {record.status === 2 && (
            <Popconfirm title="Mark this pricing request as complete?" okText="Complete" cancelText="Cancel" onConfirm={() => handleComplete(record.id)}>
              <Button size="small" icon={<CheckOutlined />} style={{ backgroundColor: "#1a7a3a", border: "none", color: "#fff", boxShadow: "none" }}>
                Complete
              </Button>
            </Popconfirm>
          )}
          {record.status === 1 && canManage() && (
            <Popconfirm title="Delete this pricing request?" okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
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
        showTotal: (total) => `${total} requests`,
        onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
      }}
      locale={{ emptyText: "No pricing requests found" }}
    />
  );

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Pricing Requests</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          New Request
        </Button>
      </Flex>

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

          <Select
            className={styles.filterSelect}
            placeholder="All Priorities"
            allowClear
            value={priorityFilter}
            onChange={(v) => { setPriorityFilter(v); setPageNumber(1); }}
            style={{ minWidth: 150 }}
          >
            {Object.entries(PRIORITY).map(([k, v]) => (
              <Option key={k} value={Number(k)}>{v.label}</Option>
            ))}
          </Select>
        </Flex>
      )}

      <Card className={styles.card} variant="outlined">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => { setTab(k as TabKey); setPageNumber(1); }}
          items={[
            { key: "all",     label: "All Requests", children: <TableContent /> },
            { key: "mine",    label: "My Requests",  children: <TableContent /> },
            ...(canManage() ? [{ key: "pending", label: "Unassigned", children: <TableContent /> }] : []),
          ]}
        />
      </Card>

      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} isPending={state.isPending} />
      <AssignModal open={showAssign} onClose={() => { setShowAssign(false); setAssignTarget(null); }} onSubmit={handleAssign} isPending={state.isPending} />

    </Flex>
  );
};

export default PricingRequestsPage;