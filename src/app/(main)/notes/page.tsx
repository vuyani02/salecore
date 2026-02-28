"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, Divider, Empty, Flex, Form,
  Modal, Pagination, Popconfirm, Row, Select,
  Switch, Tag, Typography,
} from "antd";
import {
  DeleteOutlined, EditOutlined, LockOutlined,
  PlusOutlined, UnlockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNotesState, useNotesActions } from "@/providers/notesProvider";
import { useNotesPageStyles } from "./styeles/Notesstyles";
import type {
  INote, ICreateNotePayload, IUpdateNotePayload, INotesQuery,
} from "@/providers/notesProvider/context";
import { RELATED_TO_TYPE } from "@/providers/notesProvider/context";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunitiesProvider";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useContractsState, useContractsActions } from "@/providers/contractsProvider";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

// ── Entity options hook ───────────────────────────────────────────────────────
const useEntityOptions = (relatedToType: number | undefined) => {
  const clientsState         = useClientsState();
  const { getClients }       = useClientsActions();
  const oppsState            = useOpportunitiesState();
  const { getOpportunities } = useOpportunitiesActions();
  const proposalsState       = useProposalsState();
  const { getProposals }     = useProposalsActions();
  const contractsState       = useContractsState();
  const { getContracts }     = useContractsActions();

  useEffect(() => {
    if (relatedToType === 1) getClients({ pageNumber: 1, pageSize: 100 });
    if (relatedToType === 2) getOpportunities({ pageNumber: 1, pageSize: 100 });
    if (relatedToType === 3) getProposals({ pageNumber: 1, pageSize: 100 });
    if (relatedToType === 4) getContracts({ pageNumber: 1, pageSize: 100 });
  }, [relatedToType]);

  const isLoading =
    clientsState.isPending || oppsState.isPending ||
    proposalsState.isPending || contractsState.isPending;

  const options: { label: string; value: string }[] = useMemo(() => {
    if (relatedToType === 1)
      return (clientsState.clients?.items ?? []).map((c) => ({ label: c.name,  value: c.id }));
    if (relatedToType === 2)
      return (oppsState.opportunities?.items ?? []).map((o) => ({ label: o.title, value: o.id }));
    if (relatedToType === 3)
      return (proposalsState.proposals?.items ?? []).map((p) => ({ label: p.title, value: p.id }));
    if (relatedToType === 4)
      return (contractsState.contracts?.items ?? []).map((c) => ({ label: c.title, value: c.id }));
    return [];
  }, [relatedToType, clientsState.clients, oppsState.opportunities, proposalsState.proposals, contractsState.contracts]);

  return { options, isLoading };
};

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

// ── Note Modal (Create & Edit) ────────────────────────────────────────────────
interface INoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ICreateNotePayload | IUpdateNotePayload) => void;
  isPending: boolean;
  editingNote: INote | null;
}

const NoteModal = ({ open, onClose, onSubmit, isPending, editingNote }: INoteModalProps) => {
  const [form]          = Form.useForm();
  const [relatedToType, setRelatedToType] = useState<number | undefined>();
  const isEditing = !!editingNote;

  const { options, isLoading } = useEntityOptions(relatedToType);

  // Browsable entity types (Activity excluded — no list endpoint for notes context)
  const BROWSABLE_TYPES = { 1: "Client", 2: "Opportunity", 3: "Proposal", 4: "Contract" };

  useEffect(() => {
    if (!open) return;
    if (editingNote) {
      form.setFieldsValue({
        content:   editingNote.content,
        isPrivate: editingNote.isPrivate,
      });
    } else {
      form.resetFields();
      setRelatedToType(undefined);
    }
  }, [open, editingNote]);

  const handleFinish = (values: any) => {
    if (isEditing) {
      onSubmit({ content: values.content, isPrivate: values.isPrivate ?? false } as IUpdateNotePayload);
    } else {
      onSubmit({
        content:       values.content,
        relatedToType: values.relatedToType,
        relatedToId:   values.relatedToId,
        isPrivate:     values.isPrivate ?? false,
      } as ICreateNotePayload);
    }
    form.resetFields();
    setRelatedToType(undefined);
  };

  const handleClose = () => {
    form.resetFields();
    setRelatedToType(undefined);
    onClose();
  };

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 700 }}>
            {isEditing ? "Edit Note" : "Add Note"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
            {isEditing
              ? "Only you can edit your own notes"
              : <>Fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required</>}
          </Text>
        </Flex>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={560}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isPrivate: false }}>

        {/* Link to record — only on create */}
        {!isEditing && (
          <>
            <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "8px 0 16px" }} />
            <SectionLabel step={1} title="Attach to a Record" subtitle="Which record is this note about?" />

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="relatedToType"
                  label="Record Type"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select
                    placeholder="Select type…"
                    onChange={(v) => {
                      setRelatedToType(v);
                      form.setFieldValue("relatedToId", undefined);
                    }}
                  >
                    {Object.entries(BROWSABLE_TYPES).map(([k, v]) => (
                      <Option key={k} value={Number(k)}>{v}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="relatedToId"
                  label="Record"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select
                    showSearch
                    placeholder={relatedToType ? "Search and select…" : "Select a type first"}
                    disabled={!relatedToType}
                    loading={isLoading}
                    optionFilterProp="label"
                    options={options}
                    notFoundContent={isLoading ? "Loading…" : "No records found"}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: isEditing ? "8px 0 16px" : "4px 0 16px" }} />
        <SectionLabel
          step={isEditing ? 1 : 2}
          title="Note Content"
          subtitle="Write your note — be as detailed as needed"
        />

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Note content is required" }]}
        >
          <Form.Item name="content" noStyle>
            {/* Using textarea via antd Input.TextArea equivalent */}
            <textarea
              rows={5}
              placeholder="e.g. Client requested revised pricing before end of Q1. Follow-up scheduled for next week."
              defaultValue={editingNote?.content ?? ""}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(112,112,112,0.4)",
                borderRadius: 6,
                color: "rgba(0,0,0)",
                caretColor: "#fff",
                padding: "8px 12px",
                fontSize: 14,
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                minHeight: 120,
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(112,112,112,0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(112,112,112,0.4)")}
              onChange={(e) => form.setFieldValue("content", e.target.value)}
            />
            <style>{`
              textarea::placeholder { color: rgba(255,255,255,0.25); }
            `}</style>
          </Form.Item>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel
          step={isEditing ? 2 : 3}
          title="Visibility"
          subtitle="Private notes are only visible to you"
        />

        <Form.Item name="isPrivate" label="Private Note" valuePropName="checked">
          <Switch
            checkedChildren={<><LockOutlined /> Private</>}
            unCheckedChildren={<><UnlockOutlined /> Visible to team</>}
          />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "20px 0 16px" }} />
        <Flex justify="space-between" align="center">
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            {isEditing ? "Only the note creator can edit." : "Note will be linked to the selected record."}
          </Text>
          <Flex gap={8}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
              htmlType="submit"
              loading={isPending}
            >
              {isEditing ? "Save Changes" : "Add Note"}
            </Button>
          </Flex>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── Note Card ─────────────────────────────────────────────────────────────────
interface INoteCardProps {
  note: INote;
  styles: any;
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, styles, onEdit, onDelete }: INoteCardProps) => (
  <Card className={styles.noteCard}>
    <Flex vertical gap={12}>

      {/* Top row — tags + actions */}
      <Flex justify="space-between" align="flex-start">
        <Flex gap={6} wrap="wrap">
          <Tag className={styles.relatedTag}>
            {RELATED_TO_TYPE[note.relatedToType]?.label ?? "Unknown"}
          </Tag>
          {note.isPrivate && (
            <Tag className={styles.privateTag} icon={<LockOutlined />}>Private</Tag>
          )}
        </Flex>
        <Flex gap={4}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(note)}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this note?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(note.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} style={{ boxShadow: "none" }}>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      </Flex>

      {/* Content */}
      <Text className={styles.noteContent}>{note.content}</Text>

      {/* Footer — author + date */}
      <Flex justify="space-between" align="center">
        <Text className={styles.noteMeta}>
          {note.createdByName ?? "Unknown"}
        </Text>
        <Text className={styles.noteMeta}>
          {note.createdAt
            ? `${dayjs(note.createdAt).format("DD MMM YYYY")} · ${dayjs(note.createdAt).fromNow()}`
            : "—"}
        </Text>
      </Flex>

    </Flex>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const NotesPage = () => {
  const { styles }  = useNotesPageStyles();
  const state       = useNotesState();
  const { getNotes, createNote, updateNote, deleteNote } = useNotesActions();

  const [pageNumber,          setPageNumber]          = useState(1);
  const [pageSize]                                    = useState(12);
  const [showModal,           setShowModal]           = useState(false);
  const [editingNote,         setEditingNote]         = useState<INote | null>(null);
  const [relatedToTypeFilter, setRelatedToTypeFilter] = useState<number | undefined>();

  const buildQuery = (page = pageNumber): INotesQuery => ({
    pageNumber: page,
    pageSize,
    ...(relatedToTypeFilter && { relatedToType: relatedToTypeFilter }),
  });

  useEffect(() => { getNotes({ pageNumber: 1, pageSize }); }, []);
  useEffect(() => { getNotes(buildQuery()); }, [pageNumber, relatedToTypeFilter]);

  const items      = useMemo(() => state.notes?.items ?? [], [state.notes]);
  const totalCount = state.notes?.totalCount ?? 0;

  const refresh = () => getNotes(buildQuery());

  const handleModalSubmit = async (payload: ICreateNotePayload | IUpdateNotePayload) => {
    if (editingNote) {
      await updateNote(editingNote.id, payload as IUpdateNotePayload);
    } else {
      await createNote(payload as ICreateNotePayload);
    }
    setShowModal(false);
    setEditingNote(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    refresh();
  };

  // Only show types relevant to notes (per API docs)
  const FILTER_TYPES = { 1: "Client", 2: "Opportunity", 3: "Proposal", 4: "Contract", 5: "Activity" };

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Notes</Title>
        <Button
          icon={<PlusOutlined />}
          className={styles.primaryBtn}
          onClick={() => { setEditingNote(null); setShowModal(true); }}
        >
          Add Note
        </Button>
      </Flex>

      {/* Filter */}
      <Flex gap={12}>
        <Select
          placeholder="All Record Types"
          allowClear
          value={relatedToTypeFilter}
          onChange={(v) => { setRelatedToTypeFilter(v); setPageNumber(1); }}
          style={{ minWidth: 180 }}
        >
          {Object.entries(FILTER_TYPES).map(([k, v]) => (
            <Option key={k} value={Number(k)}>{v}</Option>
          ))}
        </Select>
      </Flex>

      {/* Notes grid */}
      {state.isPending ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <Card
                loading
                className={styles.noteCard}
                style={{ minHeight: 140 }}
              />
            </Col>
          ))}
        </Row>
      ) : items.length === 0 ? (
        <Card className={styles.card}>
          <Empty
            className={styles.emptyState}
            description={<Text style={{ color: "rgba(255,255,255,0.4)" }}>No notes found</Text>}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((note) => (
            <Col key={note.id} xs={24} sm={12} lg={8}>
              <NoteCard
                note={note}
                styles={styles}
                onEdit={(n) => { setEditingNote(n); setShowModal(true); }}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <Flex justify="flex-end">
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={totalCount}
            showTotal={(total) => `${total} notes`}
            onChange={(p) => setPageNumber(p)}
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
        </Flex>
      )}

      {/* Modal */}
      <NoteModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingNote(null); }}
        onSubmit={handleModalSubmit}
        isPending={state.isPending}
        editingNote={editingNote}
      />

    </Flex>
  );
};

export default NotesPage;