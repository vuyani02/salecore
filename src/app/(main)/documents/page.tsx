"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, Divider, Flex, Form,
  Input, Modal, Popconfirm, Row, Select,
  Table, Tag, Typography, Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import {
  DeleteOutlined, DownloadOutlined, InboxOutlined, PlusOutlined,
  FileTextOutlined, FilePdfOutlined, FileImageOutlined,
  FileExcelOutlined, FileWordOutlined, FileUnknownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDocumentsState, useDocumentsActions } from "@/providers/documentsProvider";
import { useDocumentsPageStyles } from "./styeles/Documentsstyles";
import type { IDocument, IUploadDocumentPayload, IDocumentsQuery } from "@/providers/documentsProvider/context";
import { DOCUMENT_CATEGORY, RELATED_TO_TYPE } from "@/providers/documentsProvider/context";
import { useClientsState, useClientsActions } from "@/providers/clientsProvider";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunitiesProvider";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useContractsState, useContractsActions } from "@/providers/contractsProvider";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatBytes = (bytes?: number) => {
  if (!bytes) return "—";
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileIcon = ({ contentType }: { contentType?: string }) => {
  const t = contentType ?? "";
  if (t.includes("pdf"))                              return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
  if (t.includes("image"))                            return <FileImageOutlined style={{ color: "#4096ff" }} />;
  if (t.includes("sheet") || t.includes("excel"))    return <FileExcelOutlined style={{ color: "#52c41a" }} />;
  if (t.includes("word") || t.includes("document"))  return <FileWordOutlined style={{ color: "#1677ff" }} />;
  if (t.includes("text"))                             return <FileTextOutlined style={{ color: "rgba(255,255,255,0.5)" }} />;
  return <FileUnknownOutlined style={{ color: "rgba(255,255,255,0.35)" }} />;
};

const CATEGORY_COLORS: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "purple",
  4: "orange",
  5: "default",
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


// ── Entity options hook — loads the right records when relatedToType changes ──
const useEntityOptions = (relatedToType: number | undefined) => {
  const clientsState       = useClientsState();
  const { getClients }     = useClientsActions();
  const oppsState          = useOpportunitiesState();
  const { getOpportunities } = useOpportunitiesActions();
  const proposalsState     = useProposalsState();
  const { getProposals }   = useProposalsActions();
  const contractsState     = useContractsState();
  const { getContracts }   = useContractsActions();

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
      return (clientsState.clients?.items ?? []).map((c) => ({ label: c.name, value: c.id }));
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

// ── Upload Modal ──────────────────────────────────────────────────────────────
interface IUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: IUploadDocumentPayload) => void;
  isPending: boolean;
}

const UploadModal = ({ open, onClose, onSubmit, isPending }: IUploadModalProps) => {
  const [form]           = Form.useForm();
  const [selectedFile,   setSelectedFile]   = useState<File | null>(null);
  const [fileList,       setFileList]       = useState<UploadFile[]>([]);
  const [relatedToType,  setRelatedToType]  = useState<number | undefined>();

  const { options, isLoading } = useEntityOptions(relatedToType);

  const handleFinish = (values: any) => {
    if (!selectedFile) return;
    onSubmit({
      file:          selectedFile,
      category:      values.category,
      relatedToType: values.relatedToType,
      relatedToId:   values.relatedToId,
      description:   values.description,
    });
    form.resetFields();
    setSelectedFile(null);
    setFileList([]);
    setRelatedToType(undefined);
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedFile(null);
    setFileList([]);
    setRelatedToType(undefined);
    onClose();
  };

  const handleRelatedToTypeChange = (v: number) => {
    setRelatedToType(v);
    form.setFieldValue("relatedToId", undefined);
  };

  // Only show entity types that have browsable records (Activity not included
  // since the API docs don't list an /api/activities list by relatedToId for documents)
  const BROWSABLE_TYPES = { 1: "Client", 2: "Opportunity", 3: "Proposal", 4: "Contract" };

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 700 }}>
            Upload Document
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>
            Fields marked <span style={{ color: "#ff4d4f" }}>*</span> are required
          </Text>
        </Flex>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "8px 0 16px" }} />
        <SectionLabel step={1} title="Select File" subtitle="Choose a file to upload — max 50 MB" />

        <Form.Item required>
          <Upload
            fileList={fileList}
            beforeUpload={(file) => {
              setSelectedFile(file);
              setFileList([{ uid: file.uid, name: file.name, size: file.size, type: file.type, status: "done", originFileObj: file }]);
              return false;
            }}
            onRemove={() => { setSelectedFile(null); setFileList([]); }}
            maxCount={1}
          >
            <Flex
              align="center"
              justify="center"
              vertical
              gap={8}
              style={{
                width: "100%",
                padding: "24px 16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(112,112,112,0.45)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <InboxOutlined style={{ fontSize: 36, color: "rgba(255,255,255,0.3)" }} />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                Click to select a file
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                Supports PDF, Word, Excel, images and more. Max 50 MB.
              </Text>
            </Flex>
          </Upload>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={2} title="Categorise" subtitle="What type of document is this and where does it belong?" />

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Select category…">
                {Object.entries(DOCUMENT_CATEGORY).map(([k, v]) => (
                  <Option key={k} value={Number(k)}>{v.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="relatedToType"
              label="Attach To"
              rules={[{ required: true, message: "Required" }]}
              extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>What kind of record is this for?</Text>}
            >
              <Select
                placeholder="Select record type…"
                onChange={handleRelatedToTypeChange}
              >
                {Object.entries(BROWSABLE_TYPES).map(([k, v]) => (
                  <Option key={k} value={Number(k)}>{v}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="relatedToId"
          label="Select Record"
          rules={[{ required: true, message: "Please select a record" }]}
          extra={
            !relatedToType
              ? <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Choose a record type first</Text>
              : <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  Select the {BROWSABLE_TYPES[relatedToType as keyof typeof BROWSABLE_TYPES]} this document belongs to
                </Text>
          }
        >
          <Select
            showSearch
            placeholder={relatedToType ? "Search and select…" : "Select a record type first"}
            disabled={!relatedToType}
            loading={isLoading}
            optionFilterProp="label"
            options={options}
            notFoundContent={isLoading ? "Loading…" : "No records found"}
          />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "4px 0 16px" }} />
        <SectionLabel step={3} title="Description" subtitle="Optional — add context about this document" />

        <Form.Item
          name="description"
          label="Description"
          extra={<Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Optional — e.g. "Signed version received 28 Feb 2026"</Text>}
        >
          <Input.TextArea rows={2} placeholder="Brief description of this document…" />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(112,112,112,0.2)", margin: "20px 0 16px" }} />
        <Flex justify="space-between" align="center">
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            Document will be stored and linked to the selected record.
          </Text>
          <Flex gap={8}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              style={{ backgroundColor: "#707070", border: "none", color: "#fff", fontWeight: 600, boxShadow: "none" }}
              htmlType="submit"
              loading={isPending}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </Flex>
        </Flex>

      </Form>
    </Modal>
  );
};

// ── Filters ───────────────────────────────────────────────────────────────────
interface IFiltersProps {
  categoryFilter: number | undefined;
  relatedToTypeFilter: number | undefined;
  onCategoryChange: (v: number | undefined) => void;
  onRelatedToTypeChange: (v: number | undefined) => void;
}

const Filters = ({ categoryFilter, relatedToTypeFilter, onCategoryChange, onRelatedToTypeChange }: IFiltersProps) => (
  <Flex gap={12}>
    <Select
      placeholder="All Categories"
      allowClear
      value={categoryFilter}
      onChange={onCategoryChange}
      style={{ minWidth: 160 }}
    >
      {Object.entries(DOCUMENT_CATEGORY).map(([k, v]) => (
        <Option key={k} value={Number(k)}>{v.label}</Option>
      ))}
    </Select>
    <Select
      placeholder="All Entity Types"
      allowClear
      value={relatedToTypeFilter}
      onChange={onRelatedToTypeChange}
      style={{ minWidth: 170 }}
    >
      {Object.entries(RELATED_TO_TYPE).map(([k, v]) => (
        <Option key={k} value={Number(k)}>{v.label}</Option>
      ))}
    </Select>
  </Flex>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const DocumentsPage = () => {
  const { styles }  = useDocumentsPageStyles();
  const state       = useDocumentsState();
  const { getDocuments, uploadDocument, downloadDocument, deleteDocument } = useDocumentsActions();

  const [pageNumber,          setPageNumber]          = useState(1);
  const [pageSize,            setPageSize]            = useState(10);
  const [showUpload,          setShowUpload]          = useState(false);
  const [categoryFilter,      setCategoryFilter]      = useState<number | undefined>();
  const [relatedToTypeFilter, setRelatedToTypeFilter] = useState<number | undefined>();

  const buildQuery = (page = pageNumber, size = pageSize): IDocumentsQuery => ({
    pageNumber: page,
    pageSize:   size,
    ...(categoryFilter      && { category:      categoryFilter      }),
    ...(relatedToTypeFilter && { relatedToType: relatedToTypeFilter }),
  });

  useEffect(() => { getDocuments({ pageNumber: 1, pageSize: 10 }); }, []);

  useEffect(() => {
    getDocuments(buildQuery());
  }, [pageNumber, pageSize, categoryFilter, relatedToTypeFilter]);

  const items      = useMemo(() => state.documents?.items ?? [], [state.documents]);
  const totalCount = state.documents?.totalCount ?? 0;

  const refresh = () => getDocuments(buildQuery());

  const handleUpload = async (payload: IUploadDocumentPayload) => {
    await uploadDocument(payload);
    setShowUpload(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    refresh();
  };

  const columns: ColumnsType<IDocument> = [
    {
      title: "File",
      key: "file",
      render: (_: unknown, record: IDocument) => (
        <Flex align="center" gap={10}>
          <div className={styles.fileIcon}>
            <FileIcon contentType={record.contentType} />
          </div>
          <Flex vertical gap={2}>
            <Text className={styles.cellPrimary}>{record.fileName}</Text>
            {record.description && (
              <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.description}</Text>
            )}
          </Flex>
        </Flex>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (v: number) => {
        const cat = DOCUMENT_CATEGORY[v];
        return cat
          ? <Tag color={CATEGORY_COLORS[v]} style={{ marginInlineEnd: 0 }}>{cat.label}</Tag>
          : <Tag style={{ marginInlineEnd: 0 }}>Unknown</Tag>;
      },
    },
    {
      title: "Related To",
      dataIndex: "relatedToType",
      render: (v: number) => (
        <Text className={styles.cellMuted}>{RELATED_TO_TYPE[v]?.label ?? "—"}</Text>
      ),
    },
    {
      title: "Size",
      dataIndex: "fileSize",
      render: (v?: number) => <Text className={styles.cellMuted}>{formatBytes(v)}</Text>,
    },
    {
      title: "Uploaded By",
      dataIndex: "uploadedByName",
      render: (v?: string) => <Text className={styles.cellMuted}>{v ?? "—"}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (v?: string) => (
        <Text className={styles.cellMuted}>{v ? dayjs(v).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: IDocument) => (
        <Flex gap={6} justify="flex-end">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => downloadDocument(record.id, record.fileName)}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
          >
            Download
          </Button>
          <Popconfirm
            title="Delete this document?"
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

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Documents</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowUpload(true)}>
          Upload Document
        </Button>
      </Flex>

      {/* Filters */}
      <Filters
        categoryFilter={categoryFilter}
        relatedToTypeFilter={relatedToTypeFilter}
        onCategoryChange={(v) => { setCategoryFilter(v); setPageNumber(1); }}
        onRelatedToTypeChange={(v) => { setRelatedToTypeFilter(v); setPageNumber(1); }}
      />

      {/* Table */}
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
            showTotal:       (total) => `${total} documents`,
            onChange:        (p, ps) => { setPageNumber(p); setPageSize(ps); },
          }}
          locale={{ emptyText: "No documents found" }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Upload Modal */}
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={handleUpload}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default DocumentsPage;