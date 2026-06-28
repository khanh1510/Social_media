"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Webhook, Copy, Check, ChevronDown, ChevronRight, Key } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────
interface Field {
  name: string;
  type: string;
  required?: boolean;
  desc: string;
}
interface ResponseField {
  name: string;
  type: string;
  desc: string;
}
interface Endpoint {
  action: string;
  desc: string;
  requestFields: Field[];
  responseFields: ResponseField[];
  example: { req: Record<string, unknown>; res: unknown };
  badge?: string;
  badgeColor?: string;
}

// ── Data ──────────────────────────────────────────────────
const BASE_URL = "https://api.yourdomain.com/api/v2";

const ENDPOINTS: Endpoint[] = [
  {
    action: "services",
    desc: "Lấy danh sách tất cả dịch vụ đang hoạt động.",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true,  desc: "API key của tài khoản" },
      { name: "action", type: "string", required: true,  desc: 'Giá trị cố định: "services"' },
    ],
    responseFields: [
      { name: "service",  type: "number",  desc: "ID dịch vụ (publicId)" },
      { name: "name",     type: "string",  desc: "Tên dịch vụ" },
      { name: "type",     type: "string",  desc: "Loại dịch vụ (Default, Custom Comments, Drip-feed…)" },
      { name: "category", type: "string",  desc: "Tên danh mục" },
      { name: "rate",     type: "string",  desc: "Giá trên 1.000 đơn vị (VNĐ)" },
      { name: "min",      type: "string",  desc: "Số lượng tối thiểu" },
      { name: "max",      type: "string",  desc: "Số lượng tối đa" },
      { name: "dripfeed", type: "boolean", desc: "Hỗ trợ nhỏ giọt" },
      { name: "refill",   type: "boolean", desc: "Hỗ trợ bảo hành (refill)" },
      { name: "cancel",   type: "boolean", desc: "Hỗ trợ hủy đơn" },
    ],
    example: {
      req: { key: "sk-xxx", action: "services" },
      res: [
        { service: 1, name: "Facebook Likes", type: "Default", category: "Facebook", rate: "5000", min: "100", max: "10000", dripfeed: false, refill: true, cancel: false },
      ],
    },
  },
  {
    action: "add",
    desc: "Tạo đơn hàng mới.",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",      type: "string",        required: true,  desc: "API key của tài khoản" },
      { name: "action",   type: "string",        required: true,  desc: 'Giá trị cố định: "add"' },
      { name: "service",  type: "number",        required: true,  desc: "ID dịch vụ (lấy từ action services)" },
      { name: "link",     type: "string",        required: true,  desc: "URL đối tượng cần tăng tương tác" },
      { name: "quantity", type: "number",        required: false, desc: "Số lượng (bắt buộc nếu không dùng comments)" },
      { name: "comments", type: "string",        required: false, desc: "Danh sách comment, mỗi dòng 1 comment (Custom Comments)" },
      { name: "usernames",type: "string",        required: false, desc: "Danh sách username (Mentions)" },
      { name: "runs",     type: "number",        required: false, desc: "Số lần chạy (Drip-feed)" },
      { name: "interval", type: "number",        required: false, desc: "Khoảng cách giữa các lần chạy theo phút (Drip-feed)" },
    ],
    responseFields: [
      { name: "order", type: "number", desc: "Mã đơn hàng (orderNumber)" },
    ],
    example: {
      req: { key: "sk-xxx", action: "add", service: 1, link: "https://facebook.com/post/123", quantity: 1000 },
      res: { order: 42 },
    },
  },
  {
    action: "status",
    desc: "Kiểm tra trạng thái 1 hoặc nhiều đơn hàng.",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string",        required: true,  desc: "API key của tài khoản" },
      { name: "action", type: "string",        required: true,  desc: 'Giá trị cố định: "status"' },
      { name: "order",  type: "number",        required: false, desc: "Mã đơn hàng (dùng 1 trong 2: order hoặc orders)" },
      { name: "orders", type: "string",        required: false, desc: 'Nhiều mã, cách nhau bằng dấu phẩy. VD: "1,2,3"' },
    ],
    responseFields: [
      { name: "charge",      type: "string", desc: "Tổng chi phí đơn hàng" },
      { name: "start_count", type: "string", desc: "Số lượng ban đầu" },
      { name: "status",      type: "string", desc: "Trạng thái: Pending | Processing | In progress | Completed | Partial | Canceled" },
      { name: "remains",     type: "string", desc: "Số lượng còn lại" },
      { name: "currency",    type: "string", desc: "Đơn vị tiền tệ" },
    ],
    example: {
      req: { key: "sk-xxx", action: "status", order: 42 },
      res: { charge: "5000", start_count: "0", status: "In progress", remains: "500", currency: "VND" },
    },
  },
  {
    action: "refill",
    desc: "Yêu cầu bảo hành (refill) cho 1 hoặc nhiều đơn hàng.",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",    type: "string",        required: true,  desc: "API key của tài khoản" },
      { name: "action", type: "string",        required: true,  desc: 'Giá trị cố định: "refill"' },
      { name: "order",  type: "number",        required: false, desc: "Mã đơn hàng (1 trong 2)" },
      { name: "orders", type: "string",        required: false, desc: 'Nhiều mã, cách nhau bằng dấu phẩy' },
    ],
    responseFields: [
      { name: "refill", type: "number | object", desc: "ID refill, hoặc object lỗi nếu thất bại" },
    ],
    example: {
      req: { key: "sk-xxx", action: "refill", order: 42 },
      res: { refill: 7 },
    },
  },
  {
    action: "refill_status",
    desc: "Kiểm tra trạng thái yêu cầu bảo hành.",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true, desc: "API key của tài khoản" },
      { name: "action", type: "string", required: true, desc: 'Giá trị cố định: "refill_status"' },
      { name: "refill", type: "number", required: true, desc: "ID refill (lấy từ action refill)" },
    ],
    responseFields: [
      { name: "status", type: "string", desc: "Trạng thái của yêu cầu refill" },
    ],
    example: {
      req: { key: "sk-xxx", action: "refill_status", refill: 7 },
      res: { status: "Completed" },
    },
  },
  {
    action: "cancel",
    desc: "Hủy 1 hoặc nhiều đơn hàng (chỉ khả dụng với dịch vụ hỗ trợ hủy).",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",    type: "string",        required: true,  desc: "API key của tài khoản" },
      { name: "action", type: "string",        required: true,  desc: 'Giá trị cố định: "cancel"' },
      { name: "order",  type: "number",        required: false, desc: "Mã đơn hàng (1 trong 2)" },
      { name: "orders", type: "string",        required: false, desc: 'Nhiều mã, cách nhau bằng dấu phẩy' },
    ],
    responseFields: [
      { name: "order",  type: "number", desc: "Mã đơn hàng" },
      { name: "cancel", type: "string | object", desc: "Chuỗi rỗng nếu thành công, hoặc object lỗi" },
    ],
    example: {
      req: { key: "sk-xxx", action: "cancel", order: 42 },
      res: [{ order: 42, cancel: "" }],
    },
  },
  {
    action: "balance",
    desc: "Kiểm tra số dư tài khoản.",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true, desc: "API key của tài khoản" },
      { name: "action", type: "string", required: true, desc: 'Giá trị cố định: "balance"' },
    ],
    responseFields: [
      { name: "balance",  type: "string", desc: "Số dư tài khoản (decimal string)" },
      { name: "currency", type: "string", desc: "Đơn vị tiền tệ (VND)" },
    ],
    example: {
      req: { key: "sk-xxx", action: "balance" },
      res: { balance: "1500000", currency: "VND" },
    },
  },
];

// ── Copy button ───────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Box component="button" onClick={handleCopy} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.375, borderRadius: "6px", border: "1px solid", borderColor: copied ? alpha("#059669", 0.3) : "divider", bgcolor: copied ? alpha("#059669", 0.06) : alpha("#0F172A", 0.04), color: copied ? "#059669" : "text.disabled", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease" }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Đã sao chép" : "Copy"}
    </Box>
  );
}

// ── Code block ────────────────────────────────────────────
function CodeBlock({ json }: { json: unknown }) {
  const text = JSON.stringify(json, null, 2);
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <CopyButton text={text} />
      </Box>
      <Box component="pre" sx={{ m: 0, p: 2, pt: 1.5, borderRadius: "10px", bgcolor: "#0F172A", color: "#E2E8F0", fontSize: "12px", fontFamily: "monospace", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {text}
      </Box>
    </Box>
  );
}

// ── Field table ───────────────────────────────────────────
function FieldTable({ fields }: { fields: Field[] | ResponseField[] }) {
  return (
    <Box sx={{ borderRadius: "10px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "140px 90px 1fr", px: 2, py: 1, bgcolor: alpha("#0F172A", 0.03), borderBottom: "1px solid", borderColor: "divider" }}>
        {["Tham số", "Kiểu", "Mô tả"].map((h) => (
          <Typography key={h} sx={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled" }}>{h}</Typography>
        ))}
      </Box>
      {(fields as (Field | ResponseField)[]).map((f, i) => (
        <Box key={f.name} sx={{ display: "grid", gridTemplateColumns: "140px 90px 1fr", px: 2, py: 1.25, borderBottom: i < fields.length - 1 ? "1px solid" : "none", borderColor: "divider", alignItems: "start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: "#0284C7" }}>{f.name}</Typography>
            {"required" in f && f.required && (
              <Box component="span" sx={{ fontSize: "9px", fontWeight: 700, color: "#DC2626", bgcolor: alpha("#DC2626", 0.08), px: 0.5, py: 0.125, borderRadius: "4px" }}>*</Box>
            )}
          </Box>
          <Typography sx={{ fontSize: "11px", color: "#7C3AED", fontFamily: "monospace" }}>{f.type}</Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1.5 }}>{f.desc}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Endpoint card ─────────────────────────────────────────
function EndpointCard({ ep, open, onToggle }: { ep: Endpoint; open: boolean; onToggle: () => void }) {
  return (
    <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: open ? alpha("#2563EB", 0.25) : "divider", bgcolor: "background.paper", overflow: "hidden", transition: "border-color 200ms ease" }}>
      {/* Header */}
      <Box component="button" onClick={onToggle} sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 2, border: "none", bgcolor: "transparent", cursor: "pointer", textAlign: "left", transition: "bgcolor 150ms ease", "&:hover": { bgcolor: alpha("#0F172A", 0.02) } }}>
        <Box component="span" sx={{ px: 1.25, py: 0.25, borderRadius: "6px", bgcolor: alpha(ep.badgeColor ?? "#2563EB", 0.1), color: ep.badgeColor ?? "#2563EB", fontSize: "10px", fontWeight: 800, fontFamily: "monospace", flexShrink: 0 }}>
          {ep.badge ?? "POST"}
        </Box>
        <Box component="code" sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", fontFamily: "monospace", flex: 1 }}>
          action: &quot;{ep.action}&quot;
        </Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", flex: 1, display: { xs: "none", sm: "block" } }}>{ep.desc}</Typography>
        {open ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
      </Box>

      {/* Body */}
      {open && (
        <Box sx={{ px: 2.5, pb: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 2, mb: 2, lineHeight: 1.6 }}>{ep.desc}</Typography>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>Tham số yêu cầu</Typography>
          <Box sx={{ mb: 2.5 }}>
            <FieldTable fields={ep.requestFields} />
          </Box>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>Phản hồi</Typography>
          <Box sx={{ mb: 2.5 }}>
            <FieldTable fields={ep.responseFields} />
          </Box>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>Ví dụ</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", mb: 0.75 }}>Request body</Typography>
              <CodeBlock json={ep.example.req} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", mb: 0.75 }}>Response</Typography>
              <CodeBlock json={ep.example.res} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Nav items ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "auth",   label: "Authentication", icon: <Key size={13} /> },
  ...ENDPOINTS.map((ep) => ({ id: `action-${ep.action}`, label: ep.action, icon: <Box component="span" sx={{ fontSize: "10px", fontFamily: "monospace", fontWeight: 800 }}>{"{}"}</Box> })),
  { id: "errors", label: "Error Responses", icon: <Box component="span" sx={{ fontSize: "11px" }}>⊘</Box> },
];

// ── Page ──────────────────────────────────────────────────
export default function ApiDocsPage() {
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [activeNav, setActiveNav]   = useState<string>("auth");
  const pendingScrollId = useRef<string | null>(null);

  function handleToggle(action: string) {
    setOpenAction((prev) => (prev === action ? null : action));
  }

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  function scrollTo(id: string) {
    setActiveNav(id);
    scrollToId(id);
  }

  function handleNavAction(id: string, action: string) {
    setActiveNav(id);
    if (openAction !== action) {
      pendingScrollId.current = id;
      setOpenAction(action);
    } else {
      scrollToId(id);
    }
  }

  // Sau khi React commit accordion content → scroll
  useEffect(() => {
    const id = pendingScrollId.current;
    if (!id) return;
    pendingScrollId.current = null;
    const raf = requestAnimationFrame(() => scrollToId(id));
    return () => cancelAnimationFrame(raf);
  }, [openAction, scrollToId]);

  return (
    <Box sx={{ width: "100%", display: "flex", gap: { xs: 0, lg: 3 }, alignItems: "flex-start" }}>

      {/* ── Sidebar ── */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          width: 192,
          flexShrink: 0,
          position: "sticky",
          top: 24,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          py: 1.5,
          gap: 0.25,
        }}
      >
        <Typography sx={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", px: 1.75, pb: 0.75 }}>
          TRÊN TRANG NÀY
        </Typography>

        {NAV_ITEMS.map((item) => {
          const isEp    = item.id.startsWith("action-");
          const isActive = activeNav === item.id;
          return (
            <Box
              key={item.id}
              component="button"
              onClick={() => {
                if (isEp) handleNavAction(item.id, item.label);
                else scrollTo(item.id);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.75,
                mx: 0.5,
                borderRadius: "8px",
                border: "none",
                bgcolor: isActive ? alpha("#2563EB", 0.08) : "transparent",
                color: isActive ? "#2563EB" : "text.secondary",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                fontFamily: isEp ? "monospace" : "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 140ms ease",
                "&:hover": { bgcolor: alpha("#2563EB", 0.05), color: "#2563EB" },
              }}
            >
              <Box sx={{ flexShrink: 0, opacity: 0.6, display: "flex", alignItems: "center" }}>{item.icon}</Box>
              {item.label}
            </Box>
          );
        })}

        <Box sx={{ mx: 1.75, mt: 1, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "10px", color: "text.disabled", lineHeight: 1.5 }}>
            💡 Click vào action để mở chi tiết trực tiếp.
          </Typography>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Hero */}
        <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "18px", border: "1px solid", borderColor: alpha("#2563EB", 0.2), background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)", px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(37,99,235,0.12)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -30, left: -20, width: 130, height: 130, borderRadius: "50%", background: "rgba(14,165,233,0.1)", pointerEvents: "none" }} />
          <Box sx={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{ position: "absolute", inset: -4, borderRadius: "14px", background: "#2563EB", filter: "blur(8px)", opacity: 0.35 }} />
              <Box sx={{ position: "relative", width: 52, height: 52, borderRadius: "14px", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
                <Webhook size={26} color="white" />
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: { xs: "20px", sm: "26px" }, fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Tài Liệu API v2
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "text.secondary", mt: 0.5, lineHeight: 1.6, maxWidth: 560 }}>
                API dạng POST duy nhất — tất cả actions gửi về <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: alpha("#0F172A", 0.06), px: 0.75, py: 0.125, borderRadius: "4px" }}>POST {BASE_URL}</Box> với body JSON, phân biệt nhau bằng trường <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: alpha("#0F172A", 0.06), px: 0.75, py: 0.125, borderRadius: "4px" }}>action</Box>.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Base URL */}
        <Box sx={{ borderRadius: "12px", border: "1px solid", borderColor: alpha("#2563EB", 0.2), bgcolor: alpha("#2563EB", 0.03), px: 2, py: 1.5, mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled", mb: 0.5 }}>Endpoint</Typography>
            <Typography sx={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 700, color: "#2563EB" }}>{BASE_URL}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box component="span" sx={{ px: 1.25, py: 0.375, borderRadius: "6px", bgcolor: alpha("#2563EB", 0.1), color: "#2563EB", fontSize: "11px", fontWeight: 800, fontFamily: "monospace" }}>POST</Box>
            <Box component="span" sx={{ px: 1.25, py: 0.375, borderRadius: "6px", bgcolor: alpha("#059669", 0.08), color: "#059669", fontSize: "11px", fontWeight: 700 }}>Content-Type: application/json</Box>
          </Box>
        </Box>

        {/* Auth section */}
        <Box id="auth" sx={{ scrollMarginTop: "76px", borderRadius: "14px", border: "1px solid", borderColor: alpha("#7C3AED", 0.2), bgcolor: alpha("#7C3AED", 0.02), p: 2.5, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Key size={16} color="#7C3AED" />
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>Xác thực (Authentication)</Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}>
            Mỗi request phải có trường <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: alpha("#0F172A", 0.06), px: 0.75, py: 0.125, borderRadius: "4px", color: "#7C3AED" }}>key</Box> là API key của tài khoản. API key được tạo và quản lý tại trang{" "}
            <Box component={Link} href="/profile" sx={{ color: "#7C3AED", fontWeight: 600 }}>Hồ Sơ → Thông Tin</Box>.
          </Typography>
          <Box sx={{ borderRadius: "10px", bgcolor: "#0F172A", p: 2 }}>
            <Box component="pre" sx={{ m: 0, color: "#E2E8F0", fontSize: "12px", fontFamily: "monospace", lineHeight: 1.7 }}>
{`curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{"key": "sk-your-api-key", "action": "balance"}'`}
            </Box>
          </Box>
          <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1.5 }}>
            Lỗi xác thực trả về: <Box component="code" sx={{ fontFamily: "monospace", bgcolor: alpha("#DC2626", 0.07), color: "#DC2626", px: 0.5, py: 0.125, borderRadius: "4px", fontSize: "11px" }}>{`{"error": "Invalid API key"}`}</Box>
          </Typography>
        </Box>

        {/* Endpoints */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {ENDPOINTS.map((ep) => (
            <Box key={ep.action} id={`action-${ep.action}`} sx={{ scrollMarginTop: "76px" }}>
              <EndpointCard ep={ep} open={openAction === ep.action} onToggle={() => handleToggle(ep.action)} />
            </Box>
          ))}
        </Box>

        {/* Error format */}
        <Box id="errors" sx={{ scrollMarginTop: "76px", mt: 3, borderRadius: "14px", border: "1px solid", borderColor: alpha("#DC2626", 0.2), bgcolor: alpha("#DC2626", 0.02), p: 2.5 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary", mb: 1 }}>Xử lý lỗi</Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1.5, lineHeight: 1.6 }}>
            Khi có lỗi, API luôn trả về HTTP 200 với body chứa trường <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: alpha("#0F172A", 0.06), px: 0.75, py: 0.125, borderRadius: "4px" }}>error</Box>:
          </Typography>
          <CodeBlock json={{ error: "Mô tả lỗi (tiếng Anh)" }} />
          <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1.5 }}>
            Một số lỗi phổ biến: <em>Invalid API key</em> · <em>Incorrect order ID</em> · <em>service is invalid</em> · <em>Insufficient balance</em>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
