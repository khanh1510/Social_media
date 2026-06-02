"use client";

import { Box, Typography, InputBase, alpha, Slider } from "@mui/material";
import { Link2, FileText, ShoppingCart, Zap, Clock, Shield, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { servicesData } from "@/data/services";
import { platformColors } from "@/data/services";
import type { PlatformId, Service } from "@/types";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

interface Props {
  platform: PlatformId;
  serviceType: string;
}

const speedLabel: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  fast: { label: "Nhanh", icon: <Zap size={13} />, color: "#10B981" },
  medium: { label: "Trung bình", icon: <Clock size={13} />, color: "#F59E0B" },
  slow: { label: "Chậm", icon: <Clock size={13} />, color: "#EF4444" },
};

export default function CreateOrderForm({ platform, serviceType }: Props) {
  const colors = platformColors[platform] ?? platformColors.facebook;

  const services: Service[] = useMemo(() => {
    const cat = servicesData.find((c) => c.id === platform);
    if (!cat) return [];
    return cat.services.filter((s) =>
      s.name.toLowerCase().includes(serviceType.toLowerCase())
    );
  }, [platform, serviceType]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeService = selectedService ?? services[0] ?? null;

  const clampedQty = activeService
    ? Math.min(Math.max(quantity || activeService.min, activeService.min), activeService.max)
    : 0;

  const totalCost = activeService ? clampedQty * activeService.price : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim() || !activeService) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Service selector */}
      {services.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary", mb: 1 }}>
            Chọn gói dịch vụ
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {services.map((svc) => {
              const isActive = (selectedService ?? services[0])?.id === svc.id;
              const sp = speedLabel[svc.speed];
              const disabled = svc.status !== "active";
              return (
                <Box
                  key={svc.id}
                  onClick={() => !disabled && setSelectedService(svc)}
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    border: "1.5px solid",
                    borderColor: isActive ? colors.text : "divider",
                    bgcolor: isActive ? alpha(colors.text, 0.04) : "background.paper",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    transition: "all 150ms ease",
                    "&:hover": disabled ? {} : {
                      borderColor: colors.text,
                      bgcolor: alpha(colors.text, 0.03),
                    },
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  {/* Radio dot */}
                  <Box
                    sx={{
                      mt: 0.25,
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isActive ? colors.text : "divider",
                      bgcolor: isActive ? colors.text : "transparent",
                      flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isActive && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "white" }} />}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
                        {svc.name}
                      </Typography>
                      {/* speed badge */}
                      <Box
                        sx={{
                          display: "inline-flex", alignItems: "center", gap: 0.5,
                          px: 0.875, py: 0.25,
                          borderRadius: "6px",
                          bgcolor: alpha(sp.color, 0.1),
                          color: sp.color,
                          fontSize: "11px", fontWeight: 600,
                        }}
                      >
                        {sp.icon}{sp.label}
                      </Box>
                      {svc.status !== "active" && (
                        <Box sx={{ px: 0.875, py: 0.25, borderRadius: "6px", bgcolor: alpha("#EF4444", 0.1), color: "#EF4444", fontSize: "11px", fontWeight: 600 }}>
                          {svc.status === "maintenance" ? "Bảo trì" : "Chậm"}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, mt: 0.5, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                        ID: <b>{svc.id}</b>
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                        Min: <b>{svc.min.toLocaleString()}</b> — Max: <b>{svc.max.toLocaleString()}</b>
                      </Typography>
                      <Typography sx={{ fontSize: "12px", fontWeight: 700, color: colors.text }}>
                        {formatVND(svc.price)}/1
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {services.length === 0 && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            Không có dịch vụ nào cho loại này.
          </Typography>
        </Box>
      )}

      {/* Link input */}
      <Box>
        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary", mb: 0.75 }}>
          Link cần tăng tương tác <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
        </Typography>
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            px: 1.5, height: 42,
            borderRadius: "10px",
            border: "1.5px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 150ms ease",
            "&:focus-within": {
              borderColor: alpha(colors.text, 0.5),
              boxShadow: `0 0 0 3px ${alpha(colors.text, 0.08)}`,
            },
          }}
        >
          <Link2 size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
          <InputBase
            placeholder="Nhập link bài viết, trang, profile..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            fullWidth
            sx={{
              fontSize: "13px",
              "& input::placeholder": { color: "text.disabled", opacity: 1 },
              "& input": { p: 0 },
            }}
          />
        </Box>
      </Box>

      {/* Quantity */}
      {activeService && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.75 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
              Số lượng
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {activeService.min.toLocaleString()} – {activeService.max.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex", alignItems: "center", gap: 1,
              px: 1.5, height: 42,
              borderRadius: "10px",
              border: "1.5px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "all 150ms ease",
              "&:focus-within": {
                borderColor: alpha(colors.text, 0.5),
                boxShadow: `0 0 0 3px ${alpha(colors.text, 0.08)}`,
              },
            }}
          >
            <InputBase
              type="number"
              placeholder={activeService.min.toString()}
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: activeService.min, max: activeService.max }}
              fullWidth
              sx={{
                fontSize: "13px",
                "& input::placeholder": { color: "text.disabled", opacity: 1 },
                "& input": { p: 0 },
              }}
            />
          </Box>

          <Box sx={{ px: 0.5, mt: 1 }}>
            <Slider
              value={clampedQty}
              min={activeService.min}
              max={activeService.max}
              step={Math.max(1, Math.floor((activeService.max - activeService.min) / 100))}
              onChange={(_, v) => setQuantity(v as number)}
              sx={{
                color: colors.text,
                "& .MuiSlider-thumb": {
                  width: 16, height: 16,
                  "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 8px ${alpha(colors.text, 0.12)}` },
                },
                "& .MuiSlider-track": { height: 4 },
                "& .MuiSlider-rail": { height: 4, bgcolor: alpha(colors.text, 0.15) },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Note */}
      <Box>
        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary", mb: 0.75 }}>
          Ghi chú <Box component="span" sx={{ fontSize: "12px", color: "text.disabled", fontWeight: 400 }}>(tuỳ chọn)</Box>
        </Typography>
        <Box
          sx={{
            px: 1.5, py: 1,
            borderRadius: "10px",
            border: "1.5px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 150ms ease",
            "&:focus-within": {
              borderColor: alpha(colors.text, 0.5),
              boxShadow: `0 0 0 3px ${alpha(colors.text, 0.08)}`,
            },
            display: "flex", alignItems: "flex-start", gap: 1,
          }}
        >
          <FileText size={16} color="#94A3B8" style={{ flexShrink: 0, marginTop: 2 }} />
          <InputBase
            placeholder="Thêm ghi chú cho đơn hàng..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            sx={{
              fontSize: "13px",
              alignItems: "flex-start",
              "& textarea::placeholder": { color: "text.disabled", opacity: 1 },
              "& textarea": { p: 0 },
            }}
          />
        </Box>
      </Box>

      {/* Price summary */}
      {activeService && clampedQty > 0 && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: alpha(colors.text, 0.2),
            bgcolor: alpha(colors.text, 0.04),
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Số lượng</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
              {clampedQty.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Đơn giá</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
              {formatVND(activeService.price)}/1
            </Typography>
          </Box>
          <Box sx={{ height: "1px", bgcolor: "divider", my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>Tổng tiền</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: 800, color: colors.text }}>
              {formatVND(totalCost)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Submit button */}
      <Box
        component="button"
        type="submit"
        disabled={!activeService || !link.trim() || submitted}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 1.375,
          borderRadius: "12px",
          border: "none",
          background: submitted
            ? `linear-gradient(135deg, #10B981, #059669)`
            : `linear-gradient(135deg, ${colors.text}, ${alpha(colors.text, 0.8)})`,
          color: "white",
          fontSize: "14px",
          fontWeight: 700,
          cursor: !activeService || !link.trim() ? "not-allowed" : "pointer",
          opacity: !activeService || !link.trim() ? 0.6 : 1,
          transition: "all 150ms ease",
          "&:hover:not(:disabled)": {
            transform: "translateY(-1px)",
            boxShadow: `0 8px 20px ${alpha(colors.text, 0.35)}`,
          },
          "&:active:not(:disabled)": { transform: "translateY(0)" },
        }}
      >
        {submitted ? (
          <>
            <CheckCircle2 size={16} />
            Đã đặt đơn thành công!
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Đặt đơn ngay
          </>
        )}
      </Box>

      {/* Guarantee note */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
        <Shield size={14} color="#10B981" />
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          Cam kết bảo hành — Hoàn tiền nếu không đủ số lượng
        </Typography>
      </Box>
    </Box>
  );
}
