"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Col, Flex,
  Modal, Row, Select, Table, Tag, Typography, Divider, Drawer,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined, EyeOutlined,
  CheckOutlined, CloseOutlined, SendOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useProposalsState, useProposalsActions } from "@/providers/proposalsProvider";
import { useProposalsPageStyles } from "./styeles/Proposalsstyles";
import type {
  Proposal, ProposalLineItem,
} from "@/providers/proposalsProvider/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = require("antd").Input;

// ── Constants ─────────────────────────────────────────────────────────────────
const PROPOSAL_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: "Draft",     color: "default" },
  2: { label: "Submitted", color: "blue"    },
  3: { label: "Approved",  color: "green"   },
  4: { label: "Rejected",  color: "red"     },
};

const canManage = () => {
  try {
    const raw = localStorage.getItem("roles");
    if (!raw) return false;
    const roles = JSON.parse(raw) as string[];
    return roles.includes("Admin") || roles.includes("SalesManager");
  } catch {
    return false;
  }
};

const fmt = (v?: number | null, currency = "ZAR") => {
  const n = Number(v ?? 0);
  return `${currency === "ZAR" ? "R" : ""}${n.toLocaleString()}`;
};

// ── Reject Modal ──────────────────────────────────────────────────────────────
interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isPending: boolean;
}

const RejectModal = ({ open, onClose, onSubmit, isPending }: RejectModalProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <Modal
      title="Reject Proposal"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Reject"
      okButtonProps={{ danger: true, loading: isPending }}
      destroyOnHidden
    >
      <Flex vertical gap={8}>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Please provide a reason for rejection:
        </Text>
        <TextArea
          rows={3}
          value={reason}
          onChange={(e: any) => setReason(e.target.value)}
          placeholder="e.g. Pricing too high, revise and resubmit"
        />
      </Flex>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const ProposalsPage = () => {
  const { styles }  = useProposalsPageStyles();
  const state       = useProposalsState();
  const { getProposals, deleteProposal, submitProposal, approveProposal, rejectProposal } =
    useProposalsActions();

  const [pageNumber,   setPageNumber]   = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [showReject,   setShowReject]   = useState(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  useEffect(() => {
    getProposals({ pageNumber: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    getProposals({ pageNumber, pageSize, status: statusFilter });
  }, [pageNumber, pageSize, statusFilter]);

  const items      = useMemo(() => state.proposals?.items ?? [], [state.proposals]);
  const totalCount = state.proposals?.totalCount ?? 0;

  const handleDelete = async (id: string) => {
    await deleteProposal(id);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleSubmit = async (id: string) => {
    await submitProposal(id);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleApprove = async (id: string) => {
    await approveProposal(id);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const handleRejectClick = (id: string) => {
    setRejectTarget(id);
    setShowReject(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectTarget) return;
    await rejectProposal(rejectTarget, { reason });
    setShowReject(false);
    setRejectTarget(null);
    getProposals({ pageNumber, pageSize, status: statusFilter });
  };

  const columns: ColumnsType<Proposal> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Text className={styles.cellPrimary}>{title}</Text>
          <Text className={styles.cellMuted} style={{ fontSize: 12 }}>{record.clientName ?? "—"}</Text>
        </Flex>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status: number) => {
        const s = PROPOSAL_STATUS[status];
        return s ? <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.label}</Tag> : <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      width: 140,
      render: (v: number, record) => (
        <Text className={styles.cellPrimary}>{fmt(v, record.currency)}</Text>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      width: 130,
      render: (d: string) => (
        <Text className={styles.cellMuted}>{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_: unknown, record: Proposal) => (
        <Flex gap={6} justify="flex-end">
          {record.status === 1 && canManage() && (
            <>
              <Button
                type="text"
                icon={<SendOutlined />}
                size="small"
                style={{ color: "rgba(255,255,255,0.5)" }}
                onClick={() => handleSubmit(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(record.id)}
              />
            </>
          )}
          {record.status === 2 && canManage() && (
            <>
              <Button
                type="text"
                icon={<CheckOutlined />}
                size="small"
                style={{ color: "#52c41a" }}
                onClick={() => handleApprove(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleRejectClick(record.id)}
              />
            </>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical className={styles.wrapper} gap={16}>

      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} className={styles.title}>Proposals</Title>
      </Flex>

      {/* Filter */}
      <Flex gap={12}>
        <Select
          placeholder="All Statuses"
          allowClear
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPageNumber(1); }}
          style={{ minWidth: 160 }}
        >
          {Object.entries(PROPOSAL_STATUS).map(([k, v]) => (
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
            current: pageNumber,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            showTotal: (total) => `${total} proposals`,
            onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); },
          }}
          locale={{ emptyText: "No proposals found" }}
        />
      </Card>

      {/* Reject Modal */}
      <RejectModal
        open={showReject}
        onClose={() => setShowReject(false)}
        onSubmit={handleRejectSubmit}
        isPending={state.isPending}
      />

    </Flex>
  );
};

export default ProposalsPage;