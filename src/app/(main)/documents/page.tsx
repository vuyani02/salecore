"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Card, Col, Descriptions, Divider, Dropdown, Flex, Form,
  Input, Modal, Row, Select, Table, Tag, Typography, Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import {
  PlusOutlined, MoreOutlined, DownloadOutlined, DeleteOutlined,
  EyeOutlined, SearchOutlined, InboxOutlined,
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

const FileIcon = ({ contentType, size = 16 }: { contentType?: string; size?: number }) => {
  const t = contentType ?? "";
  const style = { fontSize: size };
  if (t.includes("pdf"))                             return <FilePdfOutlined    style={{ ...style, color: "#ff4d4f" }} />;
  if (t.includes("image"))                           return <FileImageOutlined  style={{ ...style, color: "#4096ff" }} />;
  if (t.includes("sheet") || t.includes("excel"))   return <FileExcelOutlined  style={{ ...style, color: "#52c41a" }} />;
  if (t.includes("word") || t.includes("document")) return <FileWordOutlined   style={{ ...style, color: "#1677ff" }} />;
  if (t.includes("text"))                            return <FileTextOutlined   style={{ ...style, color: "rgba(255,255,255,0.5)" }} />;
  return <FileUnknownOutlined style={{ ...style, color: "rgba(255,255,255,0.35)" }} />;
};

const CATEGORY_COLORS: Record<number, string> = {
  1: "blue", 2: "green", 3: "purple", 4: "orange", 5: "default",
};

const BROWSABLE_TYPES: Record<number, string> = {
  1: "Client", 2: "Opportunity", 3: "Proposal", 4: "Contract",
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
      <Text style={{ color: "rgba(0,0,0,0.85)", fontWeight: 700, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11 }}>{subtitle}</Text>
    </Flex>
  </Flex>
);

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
    if (relatedToType === 1) return (clientsState.clients?.items ?? []).map((c) => ({ label: c.name, value: c.id }));
    if (relatedToType === 2) return (oppsState.opportunities?.items ?? []).map((o) => ({ label: o.title, value: o.id }));
    if (relatedToType === 3) return (proposalsState.proposals?.items ?? []).map((p) => ({ label: p.title, value: p.id }));
    if (relatedToType === 4) return (contractsState.contracts?.items ?? []).map((c) => ({ label: c.title, value: c.id }));
    return [];
  }, [relatedToType, clientsState.clients, oppsState.opportunities, proposalsState.proposals, contractsState.contracts]);

  return { options, isLoading };
};

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ document, open, onClose, onDownload }: {
  document: IDocument | null; open: boolean; onClose: () => void;
  onDownload: () => void;
}) => {
  if (!document) return null;
  const cat = DOCUMENT_CATEGORY[document.category];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      destroyOnHidden
      width={500}
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Close</Button>
          <Button
            icon={<DownloadOutlined />}
            style={{ backgroundColor: "#707070", border: "none", color: "#fff", boxShadow: "none" }}
            onClick={() => { onDownload(); onClose(); }}
          >
            Download
          </Button>
        </Flex>
      }
      title={
        <Flex align="center" gap={12}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "rgba(112,112,112,0.2)", border: "1px solid rgba(112,112,112,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <FileIcon contentType={document.contentType} size={20} />
          </div>
          <Flex vertical gap={4}>
            <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 15, fontWeight: 700 }}>{document.fileName}</Text>
            {cat && (
              <Tag color={CATEGORY_COLORS[document.category]} style={{ marginInlineEnd: 0, width: "fit-content" }}>
                {cat.label}
              </Tag>
            )}
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
        <Descriptions.Item label="Size">{formatBytes(document.fileSize)}</Descriptions.Item>
        <Descriptions.Item label="Uploaded By">{document.uploadedByName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Date">
          {document.createdAt ? dayjs(document.createdAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Related To">
          {RELATED_TO_TYPE[document.relatedToType]?.label ?? "—"}
        </Descriptions.Item>
      </Descriptions>

      {document.description && (
        <>
          <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "12px 0" }} />
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
            Description
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.7)", fontSize: 13 }}>{document.description}</Text>
        </>
      )}
    </Modal>
  );
};

// ── Upload Modal ──────────────────────────────────────────────────────────────
const UploadModal = ({ open, onClose, onSubmit, isPending }: {
  open: boolean; onClose: () => void;
  onSubmit: (payload: IUploadDocumentPayload) => void;
  isPending: boolean;
}) => {
  const [form]          = Form.useForm();
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null);
  const [fileList,      setFileList]      = useState<UploadFile[]>([]);
  const [relatedToType, setRelatedToType] = useState<number | undefined>();

  const { options, isLoading } = useEntityOptions(relatedToType);

  const handleClose = () => {
    form.resetFields();
    setSelectedFile(null);
    setFileList([]);
    setRelatedToType(undefined);
    onClose();
  };

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

  return (
    <Modal
      title={
        <Flex vertical gap={2}>
          <Text style={{ color: "rgba(0,0,0,0.85)", fontSize: 16, fontWeight: 700 }}>Upload Document</Text>
          <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, fontWeight: 400 }}>
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

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "8px 0 16px" }} />
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
            <Flex align="center" justify="center" vertical gap={8} style={{
              width: "100%", padding: "24px 16px",
              background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.15)",
              borderRadius: 10, cursor: "pointer",
            }}>
              <InboxOutlined style={{ fontSize: 36, color: "rgba(0,0,0,0.25)" }} />
              <Text style={{ color: "rgba(0,0,0,0.65)", fontSize: 14 }}>Click to select a file</Text>
              <Text style={{ color: "rgba(0,0,0,0.35)", fontSize: 12 }}>
                Supports PDF, Word, Excel, images and more. Max 50 MB.
              </Text>
            </Flex>
          </Upload>
        </Form.Item>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "4px 0 16px" }} />
        <SectionLabel step={2} title="Categorise" subtitle="What type of document is this and where does it belong?" />

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: "Required" }]}>
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
              extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>What kind of record is this for?</Text>}
            >
              <Select
                placeholder="Select record type…"
                onChange={(v) => { setRelatedToType(v); form.setFieldValue("relatedToId", undefined); }}
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
            <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>
              {!relatedToType
                ? "Choose a record type first"
                : `Select the ${BROWSABLE_TYPES[relatedToType]} this document belongs to`}
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

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "4px 0 16px" }} />
        <SectionLabel step={3} title="Description" subtitle="Optional — add context about this document" />

        <Form.Item
          name="description"
          label="Description"
          extra={<Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 11 }}>Optional — e.g. "Signed version received 28 Feb 2026"</Text>}
        >
          <Input.TextArea rows={2} placeholder="Brief description of this document…" />
        </Form.Item>

        <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "20px 0 16px" }} />
        <Flex justify="flex-end" gap={8}>
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

      </Form>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const DocumentsPage = () => {
  const { styles }  = useDocumentsPageStyles();
  const state       = useDocumentsState();
  const { getDocuments, uploadDocument, downloadDocument, deleteDocument } = useDocumentsActions();

  const [pageNumber,          setPageNumber]          = useState(1);
  const [pageSize,            setPageSize]            = useState(5);
  const [searchTerm,          setSearchTerm]          = useState("");
  const [categoryFilter,      setCategoryFilter]      = useState<number | undefined>();
  const [relatedToTypeFilter, setRelatedToTypeFilter] = useState<number | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showUpload,    setShowUpload]    = useState(false);
  const [viewTarget,    setViewTarget]    = useState<IDocument | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const [deleteFileName, setDeleteFileName] = useState("");

  const buildQuery = (page = pageNumber, size = pageSize): IDocumentsQuery => ({
    pageNumber: page,
    pageSize:   size,
    ...(categoryFilter      && { category:      categoryFilter      }),
    ...(relatedToTypeFilter && { relatedToType: relatedToTypeFilter }),
  });

  useEffect(() => { getDocuments({ pageNumber: 1, pageSize: 10 }); }, []);
  useEffect(() => { getDocuments(buildQuery()); }, [pageNumber, pageSize, categoryFilter, relatedToTypeFilter]);

  const allItems   = useMemo(() => state.documents?.items ?? [], [state.documents]);
  const totalCount = state.documents?.totalCount ?? 0;

  // Client-side search filter
  const items = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    const q = searchTerm.toLowerCase();
    return allItems.filter((d) =>
      d.fileName?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.uploadedByName?.toLowerCase().includes(q)
    );
  }, [allItems, searchTerm]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      getDocuments(buildQuery(1, pageSize));
    }, 400);
  };

  const refresh = () => getDocuments(buildQuery());

  const handleUpload = async (payload: IUploadDocumentPayload) => {
    await uploadDocument(payload);
    setShowUpload(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteDocument(deleteTarget);
    setDeleteTarget(null);
    setDeleteFileName("");
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
      width: 60,
      render: (_: unknown, record: IDocument) => {
        const menuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => setViewTarget(record),
          },
          {
            key: "download",
            label: "Download",
            icon: <DownloadOutlined />,
            onClick: () => downloadDocument(record.id, record.fileName),
          },
          { type: "divider" as const },
          {
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => { setDeleteTarget(record.id); setDeleteFileName(record.fileName); },
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

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Documents</Title>
        <Button icon={<PlusOutlined />} className={styles.primaryBtn} onClick={() => setShowUpload(true)}>
          Upload Document
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={12} wrap="wrap">
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />}
          placeholder="Search by filename, uploader..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />
        <Select
          className={styles.filterSelect}
          placeholder="All Categories"
          allowClear
          value={categoryFilter}
          onChange={(v) => { setCategoryFilter(v); setPageNumber(1); }}
          style={{ minWidth: 160 }}
        >
          {Object.entries(DOCUMENT_CATEGORY).map(([k, v]) => (
            <Option key={k} value={Number(k)}>{v.label}</Option>
          ))}
        </Select>
        <Select
          className={styles.filterSelect}
          placeholder="All Entity Types"
          allowClear
          value={relatedToTypeFilter}
          onChange={(v) => { setRelatedToTypeFilter(v); setPageNumber(1); }}
          style={{ minWidth: 170 }}
        >
          {Object.entries(RELATED_TO_TYPE).map(([k, v]) => (
            <Option key={k} value={Number(k)}>{v.label}</Option>
          ))}
        </Select>
      </Flex>

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

      {/* View Modal */}
      <ViewModal
        document={viewTarget}
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        onDownload={() => viewTarget && downloadDocument(viewTarget.id, viewTarget.fileName)}
      />

      {/* Upload Modal */}
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={handleUpload}
        isPending={state.isPending}
      />

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => { setDeleteTarget(null); setDeleteFileName(""); }}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: state.isPending }}
        title="Delete Document"
        width={420}
      >
        <Text style={{ color: "rgba(0,0,0,0.65)" }}>
          Are you sure you want to delete <strong>{deleteFileName}</strong>? This action cannot be undone.
        </Text>
      </Modal>

    </Flex>
  );
};

export default DocumentsPage;