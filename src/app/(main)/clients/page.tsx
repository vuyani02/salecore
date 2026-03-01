"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Card, Descriptions, Divider, Flex, Form, Input,
  Modal, Popconfirm, Select, Spin, Table, Tag, Tooltip, Typography, message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined,
  EyeOutlined, EditOutlined, GlobalOutlined,
  BankOutlined, TeamOutlined, FileTextOutlined,
} from "@ant-design/icons";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useClientsPageStyles } from "./styeles/clientsStyles";
import type { Client, CreateClientPayload } from "@/providers/clientsProvider/context";
import { getAxiosInstance } from "@/util/axiosInstance";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Constants ──────────────────────────────────────────────────────────────────
const CLIENT_TYPES: Record<number, { label: string; color: string }> = {
  1: { label: "Government", color: "purple" },
  2: { label: "Private",    color: "blue"   },
  3: { label: "Partner",    color: "green"  },
};

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Retail",
  "Manufacturing", "Government", "Education", "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "50-100", "100-500", "500+"];

const CAN_DELETE = ["Admin", "SalesManager"];

// ── Spin override ─────────────────────────────────────────────────────────────
const SiteSpinner = () => (
  <Flex justify="center" align="center" style={{ padding: "48px 0" }}>
    <Spin size="large" style={{ color: "#707070" }} />
  </Flex>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, styles,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  styles: any;
}) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <div className={styles.statValue}>{value ?? "—"}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  </div>
);

// ── View Modal ────────────────────────────────────────────────────────────────
interface IViewModalProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  styles: any;
}

const ViewModal = ({ client, open, onClose, styles }: IViewModalProps) => {
  const [stats, setStats]           = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!client?.id || !open) return;
    setLoadingStats(true);
    getAxiosInstance()
      .get(`/api/clients/${client.id}/stats`)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoadingStats(false));
  }, [client?.id, open]);

  if (!client) return null;

  const type = client.clientType != null ? CLIENT_TYPES[client.clientType] : undefined;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={600}
      title={
        <Flex align="center" gap={10}>
          <div className={styles.avatarCircle}>
            {client.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <Flex vertical gap={2}>
            <Text className={styles.modalClientName}>{client.name}</Text>
            {type && <Tag color={type.color} style={{ width: "fit-content", marginInlineEnd: 0 }}>{type.label}</Tag>}
          </Flex>
        </Flex>
      }
    >
      {loadingStats ? (
        <Flex justify="center" style={{ padding: "16px 0" }}>
          <Spin size="small" />
        </Flex>
      ) : stats ? (
        <Flex gap={12} style={{ marginBottom: 20 }}>
          <StatCard icon={<FileTextOutlined />} label="Opportunities"  value={stats.opportunityCount}          styles={styles} />
          <StatCard icon={<BankOutlined />}     label="Contracts"      value={stats.contractCount}             styles={styles} />
          <StatCard icon={<TeamOutlined />}     label="Contract Value" value={`R ${(stats.totalContractValue ?? 0).toLocaleString()}`} styles={styles} />
        </Flex>
      ) : null}

      <Divider style={{ borderColor: "rgba(112,112,112,0.3)", margin: "0 0 16px" }} />

      <Descriptions column={2} size="small" labelStyle={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }} contentStyle={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>
        <Descriptions.Item label="Industry">{client.industry ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Company Size">{client.companySize ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Tax Number">{client.taxNumber ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={client.isActive ? "green" : "default"} style={{ marginInlineEnd: 0 }}>
            {client.isActive ? "Active" : "Inactive"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Billing Address" span={2}>{client.billingAddress ?? "—"}</Descriptions.Item>
        {client.website && (
          <Descriptions.Item label="Website" span={2}>
            <a href={client.website} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)" }}>
              {client.website}
            </a>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

// ── Create / Edit Modal ───────────────────────────────────────────────────────
interface IClientModalProps {
  open:      boolean;
  onClose:   () => void;
  onSubmit:  (payload: CreateClientPayload) => void;
  isPending: boolean;
  initial?:  Client | null;
}

const ClientModal = ({ open, onClose, onSubmit, isPending, initial }: IClientModalProps) => {
  const [form] = Form.useForm();
  const isEdit = !!initial;

  useEffect(() => {
    if (open && initial) form.setFieldsValue(initial);
    if (open && !initial) form.resetFields();
  }, [open, initial]);

  return (
    <Modal
      title={isEdit ? "Edit Client" : "Add Client"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>

        <Form.Item name="name" label="Client Name" rules={[{ required: true, message: "Client name is required" }]}>
          <Input placeholder="e.g. Acme Corp" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item name="industry" label="Industry" style={{ flex: 1 }}>
            <Select placeholder="Select industry" allowClear>
              {INDUSTRIES.map((i) => <Option key={i} value={i}>{i}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="clientType" label="Client Type" initialValue={1} style={{ flex: 1 }}>
            <Select>
              {Object.entries(CLIENT_TYPES).map(([k, v]) => (
                <Option key={k} value={Number(k)}>{v.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="billingAddress" label="Billing Address">
          <Input placeholder="123 Main St" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item name="taxNumber" label="Tax Number" style={{ flex: 1 }}>
            <Input placeholder="1234567890" />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size" style={{ flex: 1 }}>
            <Select placeholder="Select size" allowClear>
              {COMPANY_SIZES.map((s) => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Form.Item>
        </Flex>

        {isEdit && (
          <Form.Item name="isActive" label="Status" initialValue={true}>
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <Flex justify="flex-end" gap={8}>
            <Button onClick={onClose}>Cancel</Button>
            <Button className="styled-btn" htmlType="submit" loading={isPending}>
              {isEdit ? "Save Changes" : "Create"}
            </Button>
          </Flex>
        </Form.Item>

      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ClientsPage = () => {
  const { styles } = useClientsPageStyles();
  const state      = useClientsState();
  const { getClients, createClient, updateClient, deleteClient } = useClientsActions();

  // ── Read role client-side only to avoid hydration mismatch ───────────────
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role") ?? "";
    setCanDelete(CAN_DELETE.includes(role));
  }, []);

  // ── Filters & pagination ──────────────────────────────────────────────────
  const [pageNumber,  setPageNumber]  = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [industry,    setIndustry]    = useState<string | undefined>();
  const [clientType,  setClientType]  = useState<number | undefined>();
  const [isActive,    setIsActive]    = useState<boolean | undefined>();

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  // ── Debounce search ───────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchClients = useCallback((overrides?: object) => {
    getClients({
      pageNumber,
      pageSize,
      ...(searchTerm              && { searchTerm  }),
      ...(industry                && { industry    }),
      ...(clientType !== undefined && { clientType }),
      ...(isActive   !== undefined && { isActive   }),
      ...overrides,
    });
  }, [pageNumber, pageSize, searchTerm, industry, clientType, isActive]);

  useEffect(() => { fetchClients(); }, [pageNumber, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      getClients({ pageNumber: 1, pageSize, searchTerm: val, industry, clientType, isActive });
    }, 400);
  };

  const handleIndustryChange = (val: string) => {
    setIndustry(val);
    setPageNumber(1);
    getClients({ pageNumber: 1, pageSize, searchTerm, industry: val, clientType, isActive });
  };

  const handleClientTypeChange = (val: number) => {
    setClientType(val);
    setPageNumber(1);
    getClients({ pageNumber: 1, pageSize, searchTerm, industry, clientType: val, isActive });
  };

  const handleIsActiveChange = (val: boolean) => {
    setIsActive(val);
    setPageNumber(1);
    getClients({ pageNumber: 1, pageSize, searchTerm, industry, clientType, isActive: val });
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = async (payload: CreateClientPayload) => {
    await createClient(payload);
    setShowCreate(false);
    fetchClients();
  };

  const handleEdit = async (payload: any) => {
    if (!editClient) return;
    await updateClient(editClient.id, payload);
    setEditClient(null);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    fetchClients();
  };

  const items      = useMemo(() => state.clients?.items ?? [], [state.clients]);
  const totalCount = state.clients?.totalCount ?? 0;

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: ColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => <Text className={styles.cellPrimary}>{name}</Text>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      render: (v: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Type",
      dataIndex: "clientType",
      width: 120,
      render: (type: number) => {
        const t = CLIENT_TYPES[type];
        return t
          ? <Tag color={t.color} style={{ marginInlineEnd: 0 }}>{t.label}</Tag>
          : <Text className={styles.cellMuted}>—</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? "green" : "default"} style={{ marginInlineEnd: 0 }}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (website: string) =>
        website ? (
          <Tooltip title={website}>
            <a href={website} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.55)" }}>
              <GlobalOutlined />
            </a>
          </Tooltip>
        ) : <Text className={styles.cellMuted}>—</Text>,
    },
    {
      title: "Actions",
      width: 130,
      render: (_: any, record: Client) => (
        <Flex gap={6}>
          <Tooltip title="View Profile">
            <Button size="small" icon={<EyeOutlined />} className={styles.actionBtn} onClick={() => setViewClient(record)} />
          </Tooltip>

          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} className={styles.actionBtn} onClick={() => setEditClient(record)} />
          </Tooltip>

          {canDelete ? (
            <Popconfirm
              title="Delete client?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Tooltip title="Delete">
                <Button size="small" icon={<DeleteOutlined />} className={styles.actionBtnDanger} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title="Delete">
              <Button
                size="small"
                icon={<DeleteOutlined />}
                className={styles.actionBtnDanger}
                onClick={() => message.error("You don't have permission to delete clients.")}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Clients</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Add Client
        </Button>
      </Flex>

      <Flex gap={12} wrap="wrap">
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
          placeholder="Search by name or industry..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />
        <Select
          placeholder="Industry"
          className={styles.filterSelect}
          allowClear
          style={{ width: 160 }}
          onChange={handleIndustryChange}
          onClear={() => handleIndustryChange(undefined as any)}
        >
          {INDUSTRIES.map((i) => <Option key={i} value={i}>{i}</Option>)}
        </Select>
        <Select
          placeholder="Client Type"
          className={styles.filterSelect}
          allowClear
          style={{ width: 150 }}
          onChange={handleClientTypeChange}
          onClear={() => handleClientTypeChange(undefined as any)}
        >
          {Object.entries(CLIENT_TYPES).map(([k, v]) => (
            <Option key={k} value={Number(k)}>{v.label}</Option>
          ))}
        </Select>
        <Select
          placeholder="Status"
          className={styles.filterSelect}
          allowClear
          style={{ width: 130 }}
          onChange={handleIsActiveChange}
          onClear={() => handleIsActiveChange(undefined as any)}
        >
          <Option value={true}>Active</Option>
          <Option value={false}>Inactive</Option>
        </Select>
      </Flex>

      <Card className={styles.card} variant="outlined">
        {state.isPending ? (
          <SiteSpinner />
        ) : (
          <Table
            className={styles.table}
            dataSource={items}
            columns={columns}
            rowKey="id"
            pagination={{
              current:         pageNumber,
              pageSize,
              total:           totalCount,
              showSizeChanger: true,
              showTotal:       (total) => `${total} clients`,
              onChange:        (p, ps) => { setPageNumber(p); setPageSize(ps); },
            }}
            locale={{ emptyText: "No clients found" }}
          />
        )}
      </Card>

      <ClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isPending={state.isPending}
      />

      <ClientModal
        open={!!editClient}
        onClose={() => setEditClient(null)}
        onSubmit={handleEdit}
        isPending={state.isPending}
        initial={editClient}
      />

      <ViewModal
        client={viewClient}
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        styles={styles}
      />

    </Flex>
  );
};

export default ClientsPage;