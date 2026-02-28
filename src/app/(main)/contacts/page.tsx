"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar, Button, Card, Col, Divider, Flex, Form,
  Input, Modal, Popconfirm, Row, Select,
  Table, Tag, Tooltip, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined,
} from "@ant-design/icons";
import { useContactsState, useContactsActions } from "@/providers/contactsProvider";
import { useContactsPageStyles } from "./styeles/Contactsstyles";
import type {
  IContact, ICreateContactPayload, IUpdateContactPayload,
} from "@/providers/contactsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Helpers ───────────────────────────────────────────────────────────────────
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
      <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{subtitle}</Text>
    </Flex>
  </Flex>
);

// ── Contact Modal (Create & Edit) ─────────────────────────────────────────────
interface IContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ICreateContactPayload | IUpdateContactPayload) => void;
  isPending: boolean;
  editingContact: IContact | null;
}

const ContactModal = ({ open, onClose, onSubmit, isPending, editingContact }: IContactModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!editingContact;

  useEffect(() => {
    if (!open) return;
    if (editingContact) {
      form.setFieldsValue({
        firstName:  editingContact.firstName,
        lastName:   editingContact.lastName,
        email:      editingContact.email,
        phone:      editingContact.phone ?? "",
        jobTitle:   editingContact.jobTitle ?? "",
        department: editingContact.department ?? "",
        isPrimary:  editingContact.isPrimary ?? false,
        notes:      editingContact.notes ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [open, editingContact]);

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 700 }}>
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
            Fill in the details below — fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required
          </Text>
        </Flex>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={640}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isPrimary: false }}>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "8px 0 16px" }} />
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

        <Form.Item
          name="email"
          label="Email Address"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Primary email used for communication</Text>}
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="e.g. john.doe@company.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Include country code for international numbers</Text>}
        >
          <Input placeholder="e.g. +27 11 000 0000" />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={2} title="Role & Organisation" subtitle="Where does this contact work and what do they do?" />

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="jobTitle"
              label="Job Title"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>e.g. Procurement Manager</Text>}
            >
              <Input placeholder="e.g. IT Director" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>e.g. Finance, Operations</Text>}
            >
              <Input placeholder="e.g. Procurement" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="isPrimary"
          label={
            <Flex align="center" gap={6}>
              <span>Primary Contact</span>
              <Tooltip title="Mark this person as the main point of contact for their organisation.">
                <InfoCircleOutlined style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }} />
              </Tooltip>
            </Flex>
          }
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Marks this person as the key stakeholder</Text>}
        >
          <Select>
            <Option value={false}>No — Regular contact</Option>
            <Option value={true}>Yes — Primary contact</Option>
          </Select>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={3} title="Additional Notes" subtitle="Any extra context about this contact" />

        <Form.Item
          name="notes"
          label="Notes"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Optional — preferred contact times, background info, etc.</Text>}
        >
          <TextArea rows={3} placeholder="e.g. Prefers email. Key decision maker for IT procurement." />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "20px 0 16px" }} />
        <Flex justify="space-between" align="center">
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            {isEditing
              ? "Changes will be saved immediately."
              : <>Contact will be saved as a <strong style={{ color: "rgba(255,255,255,0.5)" }}>new record</strong> after submitting.</>}
          </Text>
          <Flex gap={8}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
              htmlType="submit"
              loading={isPending}
            >
              {isEditing ? "Save Changes" : "Add Contact"}
            </Button>
          </Flex>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ContactsPage = () => {
  const { styles } = useContactsPageStyles();
  const state      = useContactsState();
  const { getContacts, createContact, updateContact, deleteContact } = useContactsActions();

  const [pageNumber,     setPageNumber]     = useState(1);
  const [pageSize,       setPageSize]       = useState(10);
  const [showModal,      setShowModal]      = useState(false);
  const [editingContact, setEditingContact] = useState<IContact | null>(null);

  useEffect(() => { getContacts({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { getContacts({ pageNumber, pageSize }); }, [pageNumber, pageSize]);

  const items      = useMemo(() => state.contacts?.items ?? [], [state.contacts]);
  const totalCount = state.contacts?.totalCount ?? 0;

  const refresh = () => getContacts({ pageNumber, pageSize });

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

  const handleDelete = async (id: string) => {
    await deleteContact(id);
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
            {record.isPrimary && (
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
      dataIndex: "phone",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (v?: string) =>
        v ? (
          <Tag style={{
            background: "rgba(112,112,112,0.2)",
            border: "1px solid rgba(112,112,112,0.35)",
            color: "rgba(255,255,255,0.7)",
            borderRadius: 4,
            marginInlineEnd: 0,
          }}>
            {v}
          </Tag>
        ) : (
          <Text className={styles.cellMuted}>—</Text>
        ),
    },
    {
      title: "Client",
      dataIndex: "clientName",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: IContact) => (
        <Flex gap={6} justify="flex-end" wrap="wrap">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => { setEditingContact(record); setShowModal(true); }}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this contact?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} style={{ boxShadow: "none" }}>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Contacts</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => { setEditingContact(null); setShowModal(true); }}>
          Add Contact
        </Button>
      </Flex>

      <Card className={styles.card} variant="outlined">
        <Table
          className={styles.table}
          dataSource={items}
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

      <ContactModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingContact(null); }}
        onSubmit={handleModalSubmit}
        isPending={state.isPending}
        editingContact={editingContact}
      />

    </Flex>
  );
};

export default ContactsPage;