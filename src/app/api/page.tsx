"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Webhook, Copy, Check, ChevronDown, ChevronRight, Key } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────
interface Field {
  name: string;
  type: string;
  required?: boolean;
  descKey: string;
  descParams?: Record<string, string>;
}
interface ResponseField {
  name: string;
  type: string;
  descKey: string;
}
interface Endpoint {
  action: string;
  descKey: string;
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
    descKey: "descServices",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true,  descKey: "fApiKey" },
      { name: "action", type: "string", required: true,  descKey: "fActionFixed", descParams: { action: "services" } },
    ],
    responseFields: [
      { name: "service",  type: "number",  descKey: "fServiceId" },
      { name: "name",     type: "string",  descKey: "fServiceName" },
      { name: "type",     type: "string",  descKey: "fServiceType" },
      { name: "category", type: "string",  descKey: "fCategory" },
      { name: "rate",     type: "string",  descKey: "fRate" },
      { name: "min",      type: "string",  descKey: "fMin" },
      { name: "max",      type: "string",  descKey: "fMax" },
      { name: "dripfeed", type: "boolean", descKey: "fDripfeed" },
      { name: "refill",   type: "boolean", descKey: "fRefill" },
      { name: "cancel",   type: "boolean", descKey: "fCancel" },
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
    descKey: "descAdd",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",      type: "string",        required: true,  descKey: "fApiKey" },
      { name: "action",   type: "string",        required: true,  descKey: "fActionFixed", descParams: { action: "add" } },
      { name: "service",  type: "number",        required: true,  descKey: "fServiceIdFrom" },
      { name: "link",     type: "string",        required: true,  descKey: "fLink" },
      { name: "quantity", type: "number",        required: false, descKey: "fQuantity" },
      { name: "comments", type: "string",        required: false, descKey: "fComments" },
      { name: "usernames",type: "string",        required: false, descKey: "fUsernames" },
      { name: "runs",     type: "number",        required: false, descKey: "fRuns" },
      { name: "interval", type: "number",        required: false, descKey: "fInterval" },
    ],
    responseFields: [
      { name: "order", type: "number", descKey: "fOrderNumber" },
    ],
    example: {
      req: { key: "sk-xxx", action: "add", service: 1, link: "https://facebook.com/post/123", quantity: 1000 },
      res: { order: 42 },
    },
  },
  {
    action: "status",
    descKey: "descStatus",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string",        required: true,  descKey: "fApiKey" },
      { name: "action", type: "string",        required: true,  descKey: "fActionFixed", descParams: { action: "status" } },
      { name: "order",  type: "number",        required: false, descKey: "fOrderOneOfTwo" },
      { name: "orders", type: "string",        required: false, descKey: "fOrdersComma" },
    ],
    responseFields: [
      { name: "charge",      type: "string", descKey: "fCharge" },
      { name: "start_count", type: "string", descKey: "fStartCount" },
      { name: "status",      type: "string", descKey: "fStatusList" },
      { name: "remains",     type: "string", descKey: "fRemains" },
      { name: "currency",    type: "string", descKey: "fCurrency" },
    ],
    example: {
      req: { key: "sk-xxx", action: "status", order: 42 },
      res: { charge: "5000", start_count: "0", status: "In progress", remains: "500", currency: "VND" },
    },
  },
  {
    action: "refill",
    descKey: "descRefill",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",    type: "string",        required: true,  descKey: "fApiKey" },
      { name: "action", type: "string",        required: true,  descKey: "fActionFixed", descParams: { action: "refill" } },
      { name: "order",  type: "number",        required: false, descKey: "fOrderOneOfTwoShort" },
      { name: "orders", type: "string",        required: false, descKey: "fOrdersCommaShort" },
    ],
    responseFields: [
      { name: "refill", type: "number | object", descKey: "fRefillIdOrError" },
    ],
    example: {
      req: { key: "sk-xxx", action: "refill", order: 42 },
      res: { refill: 7 },
    },
  },
  {
    action: "refill_status",
    descKey: "descRefillStatus",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true, descKey: "fApiKey" },
      { name: "action", type: "string", required: true, descKey: "fActionFixed", descParams: { action: "refill_status" } },
      { name: "refill", type: "number", required: true, descKey: "fRefillId" },
    ],
    responseFields: [
      { name: "status", type: "string", descKey: "fRefillStatus" },
    ],
    example: {
      req: { key: "sk-xxx", action: "refill_status", refill: 7 },
      res: { status: "Completed" },
    },
  },
  {
    action: "cancel",
    descKey: "descCancel",
    badge: "POST",
    badgeColor: "#2563EB",
    requestFields: [
      { name: "key",    type: "string",        required: true,  descKey: "fApiKey" },
      { name: "action", type: "string",        required: true,  descKey: "fActionFixed", descParams: { action: "cancel" } },
      { name: "order",  type: "number",        required: false, descKey: "fOrderOneOfTwoShort" },
      { name: "orders", type: "string",        required: false, descKey: "fOrdersCommaShort" },
    ],
    responseFields: [
      { name: "order",  type: "number", descKey: "fOrderNumberShort" },
      { name: "cancel", type: "string | object", descKey: "fCancelResult" },
    ],
    example: {
      req: { key: "sk-xxx", action: "cancel", order: 42 },
      res: [{ order: 42, cancel: "" }],
    },
  },
  {
    action: "balance",
    descKey: "descBalance",
    badge: "GET-like",
    badgeColor: "#059669",
    requestFields: [
      { name: "key",    type: "string", required: true, descKey: "fApiKey" },
      { name: "action", type: "string", required: true, descKey: "fActionFixed", descParams: { action: "balance" } },
    ],
    responseFields: [
      { name: "balance",  type: "string", descKey: "fBalance" },
      { name: "currency", type: "string", descKey: "fCurrencyVnd" },
    ],
    example: {
      req: { key: "sk-xxx", action: "balance" },
      res: { balance: "1500000", currency: "VND" },
    },
  },
];

// ── Copy button ───────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const t = useTranslations("apiDocs");
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Box component="button" onClick={handleCopy} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.375, borderRadius: "6px", border: "1px solid", borderColor: copied ? alpha("#059669", 0.3) : "divider", bgcolor: copied ? alpha("#059669", 0.06) : "surface.subtle", color: copied ? "#059669" : "text.disabled", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease" }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? t("copied") : t("copy")}
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
  const t = useTranslations("apiDocs");
  return (
    <Box sx={{ borderRadius: "10px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "140px 90px 1fr", px: 2, py: 1, bgcolor: "surface.subtle", borderBottom: "1px solid", borderColor: "divider" }}>
        {[t("colParam"), t("colType"), t("colDesc")].map((h) => (
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
          <Typography sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1.5 }}>{t(f.descKey, "descParams" in f && f.descParams ? f.descParams : undefined)}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Endpoint card ─────────────────────────────────────────
function EndpointCard({ ep, open, onToggle }: { ep: Endpoint; open: boolean; onToggle: () => void }) {
  const t = useTranslations("apiDocs");
  return (
    <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: open ? alpha("#2563EB", 0.25) : "divider", bgcolor: "background.paper", overflow: "hidden", transition: "border-color 200ms ease" }}>
      {/* Header */}
      <Box component="button" onClick={onToggle} sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 2, border: "none", bgcolor: "transparent", cursor: "pointer", textAlign: "left", transition: "bgcolor 150ms ease", "&:hover": { bgcolor: "action.hover" } }}>
        <Box component="span" sx={{ px: 1.25, py: 0.25, borderRadius: "6px", bgcolor: alpha(ep.badgeColor ?? "#2563EB", 0.1), color: ep.badgeColor ?? "#2563EB", fontSize: "10px", fontWeight: 800, fontFamily: "monospace", flexShrink: 0 }}>
          {ep.badge ?? "POST"}
        </Box>
        <Box component="code" sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", fontFamily: "monospace", flex: 1 }}>
          action: &quot;{ep.action}&quot;
        </Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", flex: 1, display: { xs: "none", sm: "block" } }}>{t(ep.descKey)}</Typography>
        {open ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
      </Box>

      {/* Body */}
      {open && (
        <Box sx={{ px: 2.5, pb: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 2, mb: 2, lineHeight: 1.6 }}>{t(ep.descKey)}</Typography>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>{t("requestParams")}</Typography>
          <Box sx={{ mb: 2.5 }}>
            <FieldTable fields={ep.requestFields} />
          </Box>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>{t("response")}</Typography>
          <Box sx={{ mb: 2.5 }}>
            <FieldTable fields={ep.responseFields} />
          </Box>

          <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.disabled", mb: 1 }}>{t("example")}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", mb: 0.75 }}>{t("requestBody")}</Typography>
              <CodeBlock json={ep.example.req} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", mb: 0.75 }}>{t("responseLabel")}</Typography>
              <CodeBlock json={ep.example.res} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Nav items ─────────────────────────────────────────────
const NAV_ITEMS: { id: string; label: string; labelKey?: string; icon: React.ReactNode }[] = [
  { id: "auth",   label: "Authentication", labelKey: "authNavLabel", icon: <Key size={13} /> },
  ...ENDPOINTS.map((ep) => ({ id: `action-${ep.action}`, label: ep.action, icon: <Box component="span" sx={{ fontSize: "10px", fontFamily: "monospace", fontWeight: 800 }}>{"{}"}</Box> })),
  { id: "errors", label: "Error Responses", labelKey: "errorsNavLabel", icon: <Box component="span" sx={{ fontSize: "11px" }}>⊘</Box> },
];

// ── Page ──────────────────────────────────────────────────
export default function ApiDocsPage() {
  const t = useTranslations("apiDocs");
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
          {t("onThisPage")}
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
              {item.labelKey ? t(item.labelKey) : item.label}
            </Box>
          );
        })}

        <Box sx={{ mx: 1.75, mt: 1, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "10px", color: "text.disabled", lineHeight: 1.5 }}>
            {t("navHint")}
          </Typography>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Hero */}
        <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "18px", border: "1px solid", borderColor: alpha("#2563EB", 0.2), background: (t) => t.palette.mode === "dark" ? "linear-gradient(135deg, #0F1B2D 0%, #111827 100%)" : "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)", px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
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
                {t("heroTitle")}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "text.secondary", mt: 0.5, lineHeight: 1.6, maxWidth: 560 }}>
                {t("heroSubtitlePrefix")} <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: "surface.subtle", px: 0.75, py: 0.125, borderRadius: "4px" }}>POST {BASE_URL}</Box> {t("heroSubtitleMiddle")} <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: "surface.subtle", px: 0.75, py: 0.125, borderRadius: "4px" }}>action</Box>.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Base URL */}
        <Box sx={{ borderRadius: "12px", border: "1px solid", borderColor: alpha("#2563EB", 0.2), bgcolor: alpha("#2563EB", 0.03), px: 2, py: 1.5, mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled", mb: 0.5 }}>{t("endpointLabel")}</Typography>
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
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>{t("authTitle")}</Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}>
            {t("authDescPrefix")} <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: "surface.subtle", px: 0.75, py: 0.125, borderRadius: "4px", color: "#7C3AED" }}>key</Box> {t("authDescMiddle")}{" "}
            <Box component={Link} href="/profile" sx={{ color: "#7C3AED", fontWeight: 600 }}>{t("authProfileLink")}</Box>.
          </Typography>
          <Box sx={{ borderRadius: "10px", bgcolor: "#0F172A", p: 2 }}>
            <Box component="pre" sx={{ m: 0, color: "#E2E8F0", fontSize: "12px", fontFamily: "monospace", lineHeight: 1.7 }}>
{`curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{"key": "sk-your-api-key", "action": "balance"}'`}
            </Box>
          </Box>
          <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1.5 }}>
            {t("authErrorPrefix")} <Box component="code" sx={{ fontFamily: "monospace", bgcolor: alpha("#DC2626", 0.07), color: "#DC2626", px: 0.5, py: 0.125, borderRadius: "4px", fontSize: "11px" }}>{`{"error": "Invalid API key"}`}</Box>
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
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary", mb: 1 }}>{t("errorTitle")}</Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1.5, lineHeight: 1.6 }}>
            {t("errorDescPrefix")} <Box component="code" sx={{ fontFamily: "monospace", fontSize: "12px", bgcolor: "surface.subtle", px: 0.75, py: 0.125, borderRadius: "4px" }}>error</Box>:
          </Typography>
          <CodeBlock json={{ error: t("errorExampleDesc") }} />
          <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1.5 }}>
            {t("commonErrors")} <em>Invalid API key</em> · <em>Incorrect order ID</em> · <em>service is invalid</em> · <em>Insufficient balance</em>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
