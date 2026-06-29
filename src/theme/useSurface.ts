"use client";

import { useTheme } from "@mui/material/styles";

/**
 * Trả về các màu bề mặt theo mode hiện tại, để thay cho màu hardcode
 * (vd #FFFFFF, #F8FAFC, #F0F9FF) ở những nơi không tiện dùng sx token string.
 */
export function useSurface() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return {
    isDark,
    paper: theme.palette.background.paper,
    default: theme.palette.background.default,
    muted: theme.palette.surface.muted,
    hero: theme.palette.surface.hero,
    subtle: theme.palette.surface.subtle,
    divider: theme.palette.divider,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
  };
}
