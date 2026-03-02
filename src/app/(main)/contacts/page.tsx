"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar, Button, Card, Col, Descriptions, Divider, Dropdown,
  Flex, Form, Input, Modal, Row, Select, Table, Tag, Tooltip, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, StarOutlined, SearchOutlined, InfoCircleOutlined,
  MailOutlined, PhoneOutlined, UserOutlined,
} from "@ant-design/icons";
import { useContactsState, useContactsActions } from "@/providers/contactsProvider";
import { useContactsPageStyles } from "./styeles/Contactsstyles";
import { getAxiosInstance } from "@/util/axiosInstance";
import type {
  IContact, ICreateContactPayload, IUpdateContactPayload,
} from "@/providers/contactsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

// ── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ step, title, subtitle }: { step: number; title: string; subtitle: string }) => (
  <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
    <span style={{
      background: "#707070", color: "#fff", borderRadius: "50%",
      width: 24, height: 24, display: "inline-flex", alignItems: "center",
      justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>
      {step}
    </span>
    <Flex vertical gap={1}>
      <Text style={{ color: "rgba(0,0,0,0.85)", fontWeight: 700, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>{subtitle}</Text>
    </Flex>
  </Flex>
);

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ contact, open, onClose, onEdit }: {
  contact: IContact | null; open: boolean; onClose: () => void; onEdit: () => void;
}) => {
  if (!contact) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Close</Button>
          <Button
            icon={<EditOutlined />}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
            onClick={() => { onClose(); onEdit(); }}
          >
            Edit
          </Button>
        </Flex>
      }
      destroyOnHidden
      width={520}
      title={
        <Flex align="center" gap={12}>
          <Avatar
            size={44}
            style={{ background: "#707070", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}
          >
            {getInitials(contact.firstName, contact.lastName)}
          </Avatar>
          <Flex vertical gap={4}>
            <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 700 }}>
              {contact.firstName} {contact.lastName}
            </Text>
            <Flex gap={6}>
              {contact.isPrimaryContact && (
                <Tag color="blue" style={{ marginInlineEnd: 0 }}>Primary Contact</Tag>
              )}
              {contact.clientName && (
                <Tag style={{ marginInlineEnd: 0 }}>{contact.clientName}</Tag>
              )}
            </Flex>
          </Flex>
        </Flex>
      }
    >
      <Descriptions
        column={1}
        size="small"
        style={{ marginTop: 8 }}
        labelStyle={{ color: "rgba(0,0,0,0.45)", fontSize: 12, width: 130 }}
        contentStyle={{ color: "rgba(0,0,0,0.85)", fontSize: 13, fontWeight: 600 }}
      >
        <Descriptions.Item label={<Flex align="center" gap={6}><MailOutlined />Email</Flex>}>
          {contact.email}
        </Descriptions.Item>
        <Descriptions.Item label={<Flex align="center" gap={6}><PhoneOutlined />Phone</Flex>}>
          {contact.phoneNumber ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label={<Flex align="center" gap={6}><UserOutlined />Position</Flex>}>
          {contact.position ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Client">{contact.clientName ?? "—"}</Descriptions.Item>
      </Descriptions>

      {contact.notes && (
        <>
          <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "12px 0" }} />
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Notes
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.7)", fontSize: 13 }}>{contact.notes}</Text>
        </>
      )}
    </Modal>
  );
};

// ── Contact Modal (Create & Edit) ─────────────────────────────────────────────
const ContactModal = ({ open, onClose, onSubmit, isPending, editingContact }: {
  open: boolean; onClose: () => void;
  onSubmit: (payload: ICreateContactPayload | IUpdateContactPayload) => void;
  isPending: boolean; editingContact: IContact | null;
}) => {
  const [form]    = Form.useForm();
  const isEditing = !!editingContact;
  const [clients, setClients] = useState<any[]>([]);
  const instance  = getAxiosInstance();

  useEffect(() => {
    if (!open) return;
    instance.get("/api/clients", { params: { pageNumber: 1, pageSize: 100 } })
      .then((r) => setClients(r.data?.items ?? []))
      .catch(() => {});

    if (editingContact) {
      form.setFieldsValue({
        firstName:        editingContact.firstName,
        lastName:         editingContact.lastName,
        email:            editingContact.email,
        phoneNumber:      editingContact.phoneNumber ?? "",
        position:         editingContact.position ?? "",
        clientId:         editingContact.clientId ?? undefined,
        isPrimaryContact: editingContact.isPrimaryContact ?? false,
        notes:            editingContact.notes ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [open, editingContact]);

  const handleFinish = (values: any) => {
    onSubmit({ ...values, clientId: values.clientId || undefined });
    form.resetFields();
  };

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 700 }}>
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, fontWeight: 400 }}>
            Fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required
          </Text>
        </Flex>
      }
      open={open}
      onCancel={() => { form.resetFields(); onClose(); }}
      footer={null}
      destroyOnHidden
      width={640}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isPrimaryContact: false }}>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "8px 0 16px" }} />
        <SectionLabel step={1} title="Personal Information" subtitle="Basic details to identify this contact" />

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "First name is required" }]}>
              <Input placeholder="e.g. John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Last name is required" }]}>
              <Input placeholder="e.g. Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
            >
              <Input placeholder="e.g. john.doe@company.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phoneNumber" label="Phone Number"
              extra={<Text style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>Include country code</Text>}
            >
              <Input placeholder="e.g. +27 11 000 0000" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "4px 0 16px" }} />
        <SectionLabel step={2} title="Role & Organisation" subtitle="Where does this contact work and what do they do?" />

        <Form.Item name="clientId" label="Client"
          extra={<Text style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>Which client does this contact belong to?</Text>}
        >
          <Select showSearch placeholder="Select client" optionFilterProp="children" allowClear>
            {clients.map((c: any) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="position" label="Position"
          extra={<Text style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>e.g. Procurement Manager</Text>}
        >
          <Input placeholder="e.g. IT Director" />
        </Form.Item>

        <Form.Item
          name="isPrimaryContact"
          label={
            <Flex align="center" gap={6}>
              <span>Primary Contact</span>
              <Tooltip title="Mark this person as the main point of contact for their client.">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,0.3)", fontSize: 12 }} />
              </Tooltip>
            </Flex>
          }
        >
          <Select>
            <Option value={false}>No — Regular contact</Option>
            <Option value={true}>Yes — Primary contact</Option>
          </Select>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "4px 0 16px" }} />
        <SectionLabel step={3} title="Additional Notes" subtitle="Any extra context about this contact" />

        <Form.Item name="notes" label="Notes"
          extra={<Text style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>Optional — preferred contact times, background info, etc.</Text>}
        >
          <TextArea rows={3} placeholder="e.g. Prefers email. Key decision maker for IT procurement." />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "20px 0 16px" }} />
        <Flex justify="flex-end" gap={8}>
          <Button onClick={() => { form.resetFields(); onClose(); }}>Cancel</Button>
          <Button
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
            htmlType="submit"
            loading={isPending}
          >
            {isEditing ? "Save Changes" : "Add Contact"}
          </Button>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ContactsPage = () => {
  const { styles } = useContactsPageStyles();
  const state      = useContactsState();
  const { getContacts, createContact, updateContact, deleteContact, setPrimaryContact } = useContactsActions();

  const [pageNumber,     setPageNumber]    = useState(1);
  const [pageSize,       setPageSize]      = useState(5);
  const [searchTerm,     setSearchTerm]    = useState("");
  const [clientFilter,   setClientFilter]  = useState<string | undefined>();
  const [primaryFilter,  setPrimaryFilter] = useState<boolean | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [clients,        setClients]       = useState<any[]>([]);
  const [showModal,      setShowModal]     = useState(false);
  const [editingContact, setEditingContact] = useState<IContact | null>(null);
  const [viewTarget,     setViewTarget]    = useState<IContact | null>(null);
  const [deleteTarget,   setDeleteTarget]  = useState<string | null>(null);
  const [mounted,        setMounted]       = useState(false);

  const instance = getAxiosInstance();

  useEffect(() => {
    setMounted(true);
    instance.get("/api/clients", { params: { pageNumber: 1, pageSize: 100 } })
      .then((r) => setClients(r.data?.items ?? []))
      .catch(() => {});
    getContacts({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    getContacts({ pageNumber, pageSize, clientId: clientFilter });
  }, [pageNumber, pageSize, clientFilter]);

  const items      = useMemo(() => state.contacts?.items ?? [], [state.contacts]);
  const totalCount = state.contacts?.totalCount ?? 0;

  const filteredItems = useMemo(() => {
    if (primaryFilter === undefined) return items;
    return items.filter((c) => c.isPrimaryContact === primaryFilter);
  }, [items, primaryFilter]);

  const refresh = () => getContacts({ pageNumber, pageSize, clientId: clientFilter, searchTerm: searchTerm || undefined });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      getContacts({ pageNumber: 1, pageSize, clientId: clientFilter, searchTerm: val || undefined });
    }, 400);
  };

  const handleModalSubmit = async (payload: ICreateContactPayload | IUpdateContactPayload) => {
    if (editingContact) {
      await updateContact(editingContact.id, payload as IUpdateContactPayload);
    } else {
      await createContact(payload as ICreateContactPayload);
    }
    setShowModal(false);
    setEditingContact(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteContact(deleteTarget);
    setDeleteTarget(null);
    refresh();
  };

  const handleSetPrimary = async (id: string) => {
    await setPrimaryContact(id);
    refresh();
  };

  const columns: ColumnsType<IContact> = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, record: IContact) => (
        <Flex align="center" gap={10}>
          <Avatar className={styles.avatar} size={34}>
            {getInitials(record.firstName, record.lastName)}
          </Avatar>
          <Flex vertical gap={2}>
            <Text className={styles.cellPrimary}>
              {record.firstName} {record.lastName}
            </Text>
            {record.isPrimaryContact && (
              <Tag className={styles.primaryTag}>Primary</Tag>
            )}
          </Flex>
        </Flex>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (v: string) => <Text className={styles.cellMuted}>{v}</Text>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Position",
      dataIndex: "position",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_: unknown, record: IContact) => {
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
            onClick: () => { setEditingContact(record); setShowModal(true); },
          },
          ...(!record.isPrimaryContact ? [
            { type: "divider" as const },
            {
              key: "primary",
              label: "Set as Primary",
              icon: <StarOutlined />,
              onClick: () => handleSetPrimary(record.id),
            },
          ] : []),
          { type: "divider" as const },
          {
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => setDeleteTarget(record.id),
          },
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

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Contacts</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn}
          onClick={() => { setEditingContact(null); setShowModal(true); }}
        >
          Add Contact
        </Button>
      </Flex>

      {mounted && (
        <Flex gap={12} wrap="wrap">
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
            placeholder="Search by name or email..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
            style={{ width: 240 }}
          />
          <Select
            className={styles.filterSelect}
            placeholder="Client"
            allowClear
            value={clientFilter}
            onChange={(v) => { setClientFilter(v); setPageNumber(1); }}
            style={{ minWidth: 180 }}
            showSearch
            optionFilterProp="children"
          >
            {clients.map((c: any) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
          <Select
            className={styles.filterSelect}
            placeholder="Status"
            allowClear
            value={primaryFilter}
            onChange={(v) => setPrimaryFilter(v)}
            style={{ minWidth: 150 }}
          >
            <Option value={true}>Primary Only</Option>
            <Option value={false}>Regular Only</Option>
          </Select>
        </Flex>
      )}

      <Card className={styles.card} variant="outlined">
        <Table
          className={styles.table}
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
          loading={state.isPending}
          pagination={{
            current:         pageNumber,
            pageSize:        pageSize,
            total:           totalCount,
            showSizeChanger: true,
            showTotal:       (total) => `${total} contacts`,
            onChange:        (p, ps) => { setPageNumber(p); setPageSize(ps); },
          }}
          locale={{ emptyText: "No contacts found" }}
          scroll={{ x: 800 }}
        />
      </Card>

      <ViewModal
        contact={viewTarget}
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={() => { setEditingContact(viewTarget); setShowModal(true); }}
      />

      <ContactModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingContact(null); }}
        onSubmit={handleModalSubmit}
        isPending={state.isPending}
        editingContact={editingContact}
      />

      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: state.isPending }}
        title="Delete Contact"
        width={420}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to delete this contact? This action cannot be undone.
        </Text>
      </Modal>

    </Flex>
  );
};

export default ContactsPage;