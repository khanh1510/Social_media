"use client";

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  InputBase,
  MenuItem,
  Popover,
  Select,
  Switch,
  Typography,
  alpha,
} from "@mui/material";
import {
  Headphones,
  Plus,
  ChevronLeft,
  Send,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ChevronFirst,
  ChevronLast,
  ChevronRight,
  Settings,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ticketsApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Ticket, TicketMessage, TicketPriority, TicketStatus } from "@/lib/api/types";

// ── Constants ─────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];

const STATUS_CFG: Record<TicketStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  OPEN:         { label: "Mới",            color: "#2563EB", bg: "#EFF6FF", icon: <Clock size={10} /> },
  ANSWERED:     { label: "Đã giải quyết",  color: "#059669", bg: "#ECFDF5", icon: <CheckCircle size={10} /> },
  PENDING_USER: { label: "Đang xử lý",     color: "#D97706", bg: "#FFFBEB", icon: <AlertCircle size={10} /> },
  CLOSED:       { label: "Đã đóng",        color: "#64748B", bg: "#F1F5F9", icon: <X size={10} /> },
};

const PRIORITY_CFG: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  low:    { label: "Thấp",        color: "#64748B", bg: "#F1F5F9" },
  normal: { label: "Bình thường", color: "#2563EB", bg: "#EFF6FF" },
  high:   { label: "Cao",         color: "#DC2626", bg: "#FEF2F2" },
};

type TabKey = "all" | TicketStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all",         label: "Tất cả" },
  { key: "OPEN",        label: "Mới" },
  { key: "PENDING_USER",label: "Đang xử lý" },
  { key: "ANSWERED",    label: "Đã giải quyết" },
  { key: "CLOSED",      label: "Đã đóng" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Badges ────────────────────────────────────────────────
function StatusBadge({ status }: { status: TicketStatus }) {
  const t = useTranslations("support");
  const c = STATUS_CFG[status];
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, px: 0.9, py: 0.3,
      borderRadius: "6px", bgcolor: c.bg, color: c.color, fontSize: "11px", fontWeight: 600 }}>
      {c.icon}{t(`status.${status}`)}
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const t = useTranslations("support");
  const c = PRIORITY_CFG[priority];
  return (
    <Box sx={{ display: "inline-flex", px: 0.9, py: 0.3, borderRadius: "6px",
      bgcolor: c.bg, color: c.color, fontSize: "11px", fontWeight: 600 }}>
      {t(`priority.${priority}`)}
    </Box>
  );
}

// ── Create form ───────────────────────────────────────────
function CreateForm({ onCreated, onCancel }: { onCreated: (t: Ticket) => void; onCancel: () => void }) {
  const t = useTranslations("support");
  const [subject,  setSubject]  = useState("");
  const [body,     setBody]     = useState("");
  const [priority, setPriority] = useState<TicketPriority>("normal");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");

  async function handleSubmit() {
    if (!subject.trim() || !body.trim()) { setErr(t("errFillSubjectBody")); return; }
    setErr(""); setLoading(true);
    try {
      const ticket = await ticketsApi.create({ subject: subject.trim(), body: body.trim(), priority });
      onCreated(ticket);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : t("errCreate"));
    } finally { setLoading(false); }
  }

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: "12px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>{t("createTitle")}</Typography>
        <Box component="button" onClick={onCancel} sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "6px", border: "none", bgcolor: "surface.subtle", color: "text.secondary", cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}>
          <X size={14} />
        </Box>
      </Box>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {err && <Alert severity="error" onClose={() => setErr("")} sx={{ py: 0.5 }}>{err}</Alert>}

        {/* Subject */}
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>{t("subject")} <Box component="span" sx={{ color: "error.main" }}>*</Box></Typography>
          <Box sx={{ height: 38, px: 1.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", "&:focus-within": { borderColor: "#2563EB", boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}` } }}>
            <InputBase value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("subjectPlaceholder")} fullWidth sx={{ fontSize: "13px", "& input": { p: 0 } }} />
          </Box>
        </Box>

        {/* Priority */}
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>{t("priorityLabel")}</Typography>
          <Select size="small" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}
            sx={{ height: 38, fontSize: "13px", borderRadius: "8px", minWidth: 180,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" } }}>
            {(["low", "normal", "high"] as TicketPriority[]).map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: "13px" }}>
                <PriorityBadge priority={p} />
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Body */}
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>{t("content")} <Box component="span" sx={{ color: "error.main" }}>*</Box></Typography>
          <Box sx={{ borderRadius: "8px", border: "1px solid", borderColor: "divider", "&:focus-within": { borderColor: "#2563EB", boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}` } }}>
            <InputBase multiline minRows={5} value={body} onChange={(e) => setBody(e.target.value)}
              placeholder={t("contentPlaceholder")} fullWidth
              sx={{ p: 1.5, fontSize: "13px", lineHeight: 1.6 }} />
          </Box>
          <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 0.5 }}>{body.length} / 10000</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Box component="button" onClick={() => void handleSubmit()} disabled={loading}
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", bgcolor: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 2px 8px rgba(37,99,235,0.25)", "&:hover": { opacity: 0.9 } }}>
            {loading ? <CircularProgress size={13} color="inherit" /> : <Send size={13} />}
            {t("submitRequest")}
          </Box>
          <Box component="button" onClick={onCancel}
            sx={{ display: "inline-flex", alignItems: "center", px: 2, py: 1, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "transparent", color: "text.secondary", fontSize: "13px", fontWeight: 600, cursor: "pointer", "&:hover": { borderColor: "#2563EB", color: "#2563EB" } }}>
            {t("cancel")}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Chat bubble ───────────────────────────────────────────
function ChatBubble({ msg, userId }: { msg: TicketMessage; userId: string }) {
  const t = useTranslations("support");
  const isMe = msg.authorId === userId && !msg.isStaff;
  return (
    <Box sx={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 1, alignItems: "flex-end" }}>
      <Box sx={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", bgcolor: isMe ? alpha("#2563EB", 0.12) : alpha("#059669", 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "10px", fontWeight: 800, color: isMe ? "#2563EB" : "#059669" }}>{isMe ? t("you") : t("staff")}</Typography>
      </Box>
      <Box sx={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 0.4, alignItems: isMe ? "flex-end" : "flex-start" }}>
        <Box sx={{ px: 1.5, py: 1, borderRadius: isMe ? "12px 12px 3px 12px" : "12px 12px 12px 3px", bgcolor: isMe ? "#2563EB" : "surface.subtle", border: isMe ? "none" : "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "13px", color: isMe ? "white" : "text.primary", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</Typography>
        </Box>
        <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>{fmtDate(msg.createdAt)}</Typography>
      </Box>
    </Box>
  );
}

// ── Ticket detail ─────────────────────────────────────────
function TicketDetail({ ticketId, userId, onBack }: { ticketId: string; userId: string; onBack: () => void }) {
  const t = useTranslations("support");
  const [ticket,  setTicket]  = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply,   setReply]   = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [err,     setErr]     = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ticketsApi.get(ticketId)
      .then(setTicket)
      .catch(() => setErr(t("errLoadTicket")))
      .finally(() => setLoading(false));
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  async function handleReply() {
    if (!reply.trim()) return;
    setSending(true); setErr("");
    try {
      const updated = await ticketsApi.reply(ticketId, reply.trim());
      setTicket(updated); setReply("");
    } catch (e) { setErr(e instanceof ApiError ? e.message : t("errSend")); }
    finally { setSending(false); }
  }

  async function handleClose() {
    setClosing(true); setErr("");
    try {
      await ticketsApi.close(ticketId);
      setTicket((prev) => prev ? { ...prev, status: "CLOSED" } : prev);
    } catch (e) { setErr(e instanceof ApiError ? e.message : t("errClose")); }
    finally { setClosing(false); }
  }

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  if (!ticket) return <Alert severity="error">{err || t("notFound")}</Alert>;

  const isClosed = ticket.status === "CLOSED";

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: "12px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Box component="button" onClick={onBack} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "7px", border: "1px solid", borderColor: "divider", bgcolor: "transparent", color: "text.secondary", fontSize: "12px", fontWeight: 600, cursor: "pointer", "&:hover": { borderColor: "#2563EB", color: "#2563EB" } }}>
          <ChevronLeft size={13} /> {t("back")}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.subject}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3, flexWrap: "wrap" }}>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>#{ticket.id.slice(0, 8).toUpperCase()} · {fmtDate(ticket.createdAt)}</Typography>
          </Box>
        </Box>
        {!isClosed && (
          <Box component="button" onClick={() => void handleClose()} disabled={closing}
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "7px", border: "1px solid", borderColor: alpha("#DC2626", 0.35), bgcolor: "transparent", color: "#DC2626", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: closing ? 0.6 : 1, "&:hover": { bgcolor: alpha("#DC2626", 0.04) } }}>
            {closing ? <CircularProgress size={11} color="inherit" /> : <X size={11} />}
            {t("closeTicket")}
          </Box>
        )}
      </Box>

      {err && <Alert severity="error" sx={{ mx: 3, mt: 2, py: 0.5 }} onClose={() => setErr("")}>{err}</Alert>}

      {/* Messages */}
      <Box sx={{ height: "calc(100vh - 320px)", minHeight: 300, overflowY: "auto", p: 2.5, display: "flex", flexDirection: "column", gap: 2, bgcolor: "surface.muted" }}>
        {(ticket.messages ?? []).length === 0 ? (
          <Typography sx={{ fontSize: "13px", color: "text.disabled", textAlign: "center", py: 6 }}>{t("noMessages")}</Typography>
        ) : (
          (ticket.messages ?? []).map((msg) => <ChatBubble key={msg.id} msg={msg} userId={userId} />)
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Reply */}
      <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        {!isClosed ? (
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Box sx={{ flex: 1, borderRadius: "8px", border: "1.5px solid", borderColor: "divider", bgcolor: "background.paper", "&:focus-within": { borderColor: "#2563EB", boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}` } }}>
              <InputBase multiline minRows={2} maxRows={6} value={reply} onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) void handleReply(); }}
                placeholder={t("replyPlaceholder")} fullWidth sx={{ p: 1.25, fontSize: "13px", lineHeight: 1.6 }} />
            </Box>
            <Box component="button" onClick={() => void handleReply()} disabled={sending || !reply.trim()}
              sx={{ flexShrink: 0, width: 32, height: 32, borderRadius: "8px", border: "none", bgcolor: reply.trim() ? "#2563EB" : "surface.subtle", color: reply.trim() ? "white" : "text.disabled", display: "flex", alignItems: "center", justifyContent: "center", cursor: reply.trim() ? "pointer" : "default", transition: "all 150ms" }}>
              {sending ? <CircularProgress size={14} color="inherit" /> : <Send size={14} />}
            </Box>
          </Box>
        ) : (
          <Typography sx={{ fontSize: "12px", color: "text.disabled", textAlign: "center", py: 1 }}>{t("ticketClosedNote")}</Typography>
        )}
      </Box>
    </Box>
  );
}

// ── Pagination ────────────────────────────────────────────
function Paginator({ page, total, pageSize, onPage, onPageSize }: { page: number; total: number; pageSize: number; onPage: (p: number) => void; onPageSize: (s: number) => void }) {
  const t = useTranslations("support");
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const btnSx = (active?: boolean) => ({
    display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "7px",
    border: "1px solid", borderColor: active ? "#2563EB" : "divider",
    bgcolor: active ? "#2563EB" : "transparent", color: active ? "white" : "text.secondary",
    fontSize: "12px", fontWeight: 600, cursor: "pointer",
    "&:hover": { borderColor: "#2563EB", color: active ? "white" : "#2563EB" },
    "&:disabled": { opacity: 0.35, cursor: "default", pointerEvents: "none" },
  });
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>{t("rowsPerPage")}</Typography>
        <Select size="small" value={pageSize} onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }}
          sx={{ height: 30, fontSize: "12px", borderRadius: "8px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" }, "& .MuiSelect-select": { py: 0, px: 1 } }}>
          {PAGE_SIZES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: "12px" }}>{s}</MenuItem>)}
        </Select>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box component="button" onClick={() => onPage(1)} disabled={page === 1} sx={btnSx()}><ChevronFirst size={13} /></Box>
        <Box component="button" onClick={() => onPage(page - 1)} disabled={page === 1} sx={btnSx()}><ChevronLeft size={13} /></Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", px: 0.5 }}>{page} / {totalPages}</Typography>
        <Box component="button" onClick={() => onPage(page + 1)} disabled={page >= totalPages} sx={btnSx()}><ChevronRight size={13} /></Box>
        <Box component="button" onClick={() => onPage(totalPages)} disabled={page >= totalPages} sx={btnSx()}><ChevronLast size={13} /></Box>
      </Box>
    </Box>
  );
}

// ── Column config ─────────────────────────────────────────
const COLUMNS = [
  { key: "id",       label: "_id" },
  { key: "subject",  label: "Subject" },
  { key: "category", label: "Category" },
  { key: "priority", label: "Priority" },
  { key: "status",   label: "Status" },
  { key: "createdAt",label: "CreatedAt" },
  { key: "updatedAt",label: "UpdatedAt" },
] as const;
type ColKey = typeof COLUMNS[number]["key"];
type ColVisible = Record<ColKey, boolean>;
const DEFAULT_COL_VISIBLE: ColVisible = { id: true, subject: true, category: true, priority: true, status: true, createdAt: true, updatedAt: true };

// ── Page ──────────────────────────────────────────────────
type View = "list" | "create" | "detail";

export default function SupportPage() {
  const t = useTranslations("support");
  const { user } = useAuth();

  const [view,       setView]       = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [tickets,    setTickets]    = useState<Ticket[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [loadErr,    setLoadErr]    = useState("");

  const [activeTab,    setActiveTab]    = useState<TabKey>("all");
  const [searchId,     setSearchId]     = useState("");
  const [searchSubj,   setSearchSubj]   = useState("");
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [selectedIds,  setSelectedIds]  = useState<string[]>([]);
  const [colVisible,   setColVisible]   = useState<ColVisible>(DEFAULT_COL_VISIBLE);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);

  function loadTickets(p = page, ps = pageSize) {
    setLoading(true); setLoadErr("");
    ticketsApi.list(p, ps)
      .then((res) => { setTickets(res.data); setTotal(res.meta.total); })
      .catch((e) => setLoadErr(e instanceof ApiError ? e.message : t("errLoadList")))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadTickets(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePage(p: number) { setPage(p); loadTickets(p, pageSize); }
  function handlePageSize(ps: number) { setPageSize(ps); setPage(1); loadTickets(1, ps); }

  // Client-side filter (tab + search) over current page
  const displayed = tickets.filter((t) => {
    if (activeTab !== "all" && t.status !== activeTab) return false;
    if (searchId   && !t.id.toLowerCase().includes(searchId.toLowerCase())) return false;
    if (searchSubj && !t.subject.toLowerCase().includes(searchSubj.toLowerCase())) return false;
    return true;
  });

  const selectedSet = new Set(selectedIds);
  const allChecked  = displayed.length > 0 && displayed.every((t) => selectedSet.has(t.id));
  const someChecked = displayed.length > 0 && !allChecked && displayed.some((t) => selectedSet.has(t.id));

  function toggleAll() {
    if (allChecked) {
      const displayedIds = new Set(displayed.map((t) => t.id));
      setSelectedIds((prev) => prev.filter((id) => !displayedIds.has(id)));
    } else {
      const toAdd = displayed.map((t) => t.id).filter((id) => !selectedSet.has(id));
      setSelectedIds((prev) => [...prev, ...toAdd]);
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Count per status for tabs
  const countOf = (key: TabKey) => key === "all" ? tickets.length : tickets.filter((t) => t.status === key).length;

  function handleCreated(t: Ticket) {
    setTickets((prev) => [t, ...prev]);
    setTotal((n) => n + 1);
    setSelectedId(t.id);
    setView("detail");
  }

  if (view === "create") {
    return (
      <Box sx={{ width: "100%" }}>
        <CreateForm onCreated={handleCreated} onCancel={() => setView("list")} />
      </Box>
    );
  }

  if (view === "detail" && selectedId && user) {
    return (
      <Box sx={{ width: "100%" }}>
        <TicketDetail ticketId={selectedId} userId={user.id} onBack={() => { setView("list"); loadTickets(); }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: "linear-gradient(135deg, #06B6D4, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
            <Headphones size={20} color="white" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "18px", fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}>{t("title")}</Typography>
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{t("subtitle")}</Typography>
          </Box>
        </Box>
        <Box component="button" onClick={() => setView("create")}
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", bgcolor: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.3)", "&:hover": { opacity: 0.9 } }}>
          <Plus size={14} /> {t("createNew")}
        </Box>
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ display: "flex", gap: 0.75, mb: 2, flexWrap: "wrap" }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          const count  = countOf(tab.key);
          return (
            <Box key={tab.key} component="button" onClick={() => { setActiveTab(tab.key); }}
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.625, borderRadius: "8px", border: "1.5px solid", borderColor: active ? "#2563EB" : "divider", bgcolor: active ? "#2563EB" : "background.paper", color: active ? "white" : "text.secondary", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease", "&:hover": { borderColor: "#2563EB", color: active ? "white" : "#2563EB" } }}>
              {tab.key !== "all" && STATUS_CFG[tab.key as TicketStatus].icon}
              {t(`tabs.${tab.key}`)}
              <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, px: 0.5, borderRadius: "5px", bgcolor: active ? "rgba(255,255,255,0.25)" : "surface.subtle", fontSize: "10px", fontWeight: 700 }}>
                {count}
              </Box>
            </Box>
          );
        })}
      </Box>

      {loadErr && <Alert severity="error" sx={{ mb: 2 }}>{loadErr}</Alert>}

      {/* ── Table card ── */}
      <Box sx={{ bgcolor: "background.paper", borderRadius: "12px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {/* Table header bar */}
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>{t("listTitle")}</Typography>
          <Box component="button" onClick={(e) => setSettingsAnchor(e.currentTarget)}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "8px", border: "1px solid", borderColor: settingsAnchor ? "#2563EB" : "divider", bgcolor: settingsAnchor ? alpha("#2563EB", 0.06) : "transparent", color: settingsAnchor ? "#2563EB" : "text.secondary", cursor: "pointer", "&:hover": { color: "#2563EB", borderColor: "#2563EB" } }}>
            <Settings size={14} />
          </Box>
          <Popover open={!!settingsAnchor} anchorEl={settingsAnchor} onClose={() => setSettingsAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { sx: { mt: 0.75, borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid", borderColor: "divider", minWidth: 200 } } }}>
            <Box sx={{ py: 1 }}>
              {COLUMNS.map((col) => (
                <Box key={col.key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 0.5 }}>
                  <Typography sx={{ fontSize: "13px", color: "text.primary" }}>{col.label}</Typography>
                  <Switch size="small" checked={colVisible[col.key]} onChange={(_, v) => setColVisible((prev) => ({ ...prev, [col.key]: v }))} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#2563EB" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#2563EB" } }} />
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>

        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            {/* Col headers */}
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: "surface.muted" }}>
                <Box component="th" sx={{ width: 40, px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", textAlign: "center" }}>
                  <Checkbox size="small" sx={{ p: 0 }} checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
                </Box>
                {COLUMNS.map((col) => colVisible[col.key] && (
                  <Box key={col.key} component="th" sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "text.secondary", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {t(`colHeader.${col.key}`)}
                  </Box>
                ))}
              </Box>
              {/* Search row */}
              <Box component="tr">
                <Box component="td" sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }} />
                {colVisible.id && (
                  <Box component="td" sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ height: 30, px: 1, borderRadius: "6px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 0.5, "&:focus-within": { borderColor: "#2563EB" } }}>
                      <Search size={12} color="#94A3B8" />
                      <InputBase value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder={t("searchPlaceholder")} sx={{ fontSize: "12px", flex: 1, "& input": { p: 0 } }} />
                    </Box>
                  </Box>
                )}
                {colVisible.subject && (
                  <Box component="td" sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ height: 30, px: 1, borderRadius: "6px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 0.5, "&:focus-within": { borderColor: "#2563EB" } }}>
                      <Search size={12} color="#94A3B8" />
                      <InputBase value={searchSubj} onChange={(e) => setSearchSubj(e.target.value)} placeholder={t("searchPlaceholder")} sx={{ fontSize: "12px", flex: 1, "& input": { p: 0 } }} />
                    </Box>
                  </Box>
                )}
                {(["category", "priority", "status", "createdAt", "updatedAt"] as ColKey[]).map((k) => colVisible[k] && (
                  <Box key={k} component="td" sx={{ borderBottom: "1px solid", borderColor: "divider" }} />
                ))}
              </Box>
            </Box>

            {/* Body */}
            <Box component="tbody">
              {loading ? (
                <Box component="tr">
                  <Box component="td" colSpan={8} sx={{ py: 8, textAlign: "center" }}>
                    <CircularProgress size={28} />
                  </Box>
                </Box>
              ) : displayed.length === 0 ? (
                <Box component="tr">
                  <Box component="td" colSpan={8} sx={{ py: 8, textAlign: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <MessageSquare size={28} color="#94A3B8" />
                      <Typography sx={{ fontSize: "13px", color: "text.disabled" }}>{t("emptyList")}</Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                displayed.map((t) => (
                  <Box key={t.id} component="tr"
                    onClick={() => { setSelectedId(t.id); setView("detail"); }}
                    sx={{ cursor: "pointer", "&:hover td": { bgcolor: alpha("#2563EB", 0.025) }, "&:not(:last-child) td": { borderBottom: "1px solid", borderColor: "divider" } }}>
                    <Box component="td" sx={{ px: 2, py: 1.5, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                      <Checkbox size="small" sx={{ p: 0 }} checked={selectedSet.has(t.id)} onChange={() => toggleOne(t.id)} />
                    </Box>
                    {colVisible.id && (
                      <Box component="td" sx={{ px: 2, py: 1.5, whiteSpace: "nowrap" }}>
                        <Typography sx={{ fontSize: "12px", fontFamily: "monospace", color: "text.secondary", fontWeight: 600 }}>#{t.id.slice(0, 8).toUpperCase()}</Typography>
                      </Box>
                    )}
                    {colVisible.subject && (
                      <Box component="td" sx={{ px: 2, py: 1.5, maxWidth: 260 }}>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</Typography>
                      </Box>
                    )}
                    {colVisible.category && (
                      <Box component="td" sx={{ px: 2, py: 1.5 }}>
                        <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>—</Typography>
                      </Box>
                    )}
                    {colVisible.priority && (
                      <Box component="td" sx={{ px: 2, py: 1.5 }}><PriorityBadge priority={t.priority} /></Box>
                    )}
                    {colVisible.status && (
                      <Box component="td" sx={{ px: 2, py: 1.5 }}><StatusBadge status={t.status} /></Box>
                    )}
                    {colVisible.createdAt && (
                      <Box component="td" sx={{ px: 2, py: 1.5, whiteSpace: "nowrap" }}>
                        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{fmtDate(t.createdAt)}</Typography>
                      </Box>
                    )}
                    {colVisible.updatedAt && (
                      <Box component="td" sx={{ px: 2, py: 1.5, whiteSpace: "nowrap" }}>
                        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{fmtDate(t.updatedAt)}</Typography>
                      </Box>
                    )}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>

        {/* Pagination footer */}
        <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid", borderColor: "divider", bgcolor: "surface.muted" }}>
          <Paginator page={page} total={total} pageSize={pageSize} onPage={handlePage} onPageSize={handlePageSize} />
        </Box>
      </Box>
    </Box>
  );
}
