import { createTheme, alpha, type Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      bg: string;
      border: string;
      text: string;
      textMuted: string;
      activeItemBg: string;
      hoverItemBg: string;
    };
    surface: {
      /** Nền phụ nhẹ (thay #F8FAFC) */
      muted: string;
      /** Nền vùng hero pastel (thay #F0F9FF / #EFF6FF) */
      hero: string;
      /** Nền hover/zebra rất nhẹ (thay alpha("#0F172A",0.02–0.04)) */
      subtle: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      bg?: string;
      border?: string;
      text?: string;
      textMuted?: string;
      activeItemBg?: string;
      hoverItemBg?: string;
    };
    surface?: {
      muted?: string;
      hero?: string;
      subtle?: string;
    };
  }
}

export type ColorMode = "light" | "dark";

// Bảng màu riêng cho từng chế độ. Các token (background, text, divider, sidebar...)
// được các component đọc qua theme nên sẽ tự đổi theo mode.
const lightPalette = {
  mode: "light" as const,
  primary: { main: "#2563EB", light: "#3B82F6", dark: "#1D4ED8", contrastText: "#FFFFFF" },
  success: { main: "#10B981", light: "#34D399", dark: "#059669" },
  info: { main: "#0EA5E9", light: "#38BDF8", dark: "#0284C7" },
  warning: { main: "#06B6D4", light: "#22D3EE", dark: "#0891B2" },
  error: { main: "#EF4444", light: "#F87171", dark: "#DC2626" },
  background: { default: "#F8FAFC", paper: "#FFFFFF" },
  text: { primary: "#0F172A", secondary: "#64748B", disabled: "#94A3B8" },
  divider: "#E2E8F0",
  sidebar: {
    bg: "#FFFFFF",
    border: "#E2E8F0",
    text: "#0F172A",
    textMuted: "#64748B",
    activeItemBg: alpha("#2563EB", 0.08),
    hoverItemBg: alpha("#0F172A", 0.04),
  },
  surface: {
    muted: "#F8FAFC",
    hero: "#F0F9FF",
    subtle: alpha("#0F172A", 0.03),
  },
};

const darkPalette = {
  mode: "dark" as const,
  primary: { main: "#3B82F6", light: "#60A5FA", dark: "#2563EB", contrastText: "#FFFFFF" },
  success: { main: "#34D399", light: "#6EE7B7", dark: "#10B981" },
  info: { main: "#38BDF8", light: "#7DD3FC", dark: "#0EA5E9" },
  warning: { main: "#22D3EE", light: "#67E8F9", dark: "#06B6D4" },
  error: { main: "#F87171", light: "#FCA5A5", dark: "#EF4444" },
  background: { default: "#0B1120", paper: "#111827" },
  text: { primary: "#E2E8F0", secondary: "#94A3B8", disabled: "#64748B" },
  divider: "#1E293B",
  sidebar: {
    bg: "#111827",
    border: "#1E293B",
    text: "#E2E8F0",
    textMuted: "#94A3B8",
    activeItemBg: alpha("#3B82F6", 0.16),
    hoverItemBg: alpha("#FFFFFF", 0.05),
  },
  surface: {
    muted: "#0F172A",
    hero: "#0F1B2D",
    subtle: alpha("#FFFFFF", 0.04),
  },
};

const typography = {
  fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
  h4: { fontSize: "22px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em" },
  h5: { fontSize: "18px", fontWeight: 700, lineHeight: 1.4 },
  h6: { fontSize: "16px", fontWeight: 700, lineHeight: 1.4 },
  subtitle1: { fontSize: "15px", fontWeight: 600, lineHeight: 1.5 },
  subtitle2: { fontSize: "13px", fontWeight: 600, lineHeight: 1.5 },
  body1: { fontSize: "14px", fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: "13px", fontWeight: 400, lineHeight: 1.5 },
  caption: {
    fontSize: "11px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  overline: { fontSize: "10px", fontWeight: 700, lineHeight: 1.6, letterSpacing: "0.1em" },
  button: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    textTransform: "none" as const,
  },
};

const shadows: Theme["shadows"] = [
  "none",
  "0 1px 2px rgba(0,0,0,0.05)",
  "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
  "0 2px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
  "0 4px 8px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
  "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
  "0 6px 16px rgba(0,0,0,0.08), 0 3px 8px rgba(0,0,0,0.05)",
  "0 8px 20px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)",
  "0 8px 24px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05)",
  "0 10px 28px rgba(0,0,0,0.09), 0 5px 14px rgba(0,0,0,0.06)",
  "0 12px 32px rgba(0,0,0,0.10), 0 6px 16px rgba(0,0,0,0.06)",
  "0 12px 36px rgba(0,0,0,0.10), 0 6px 18px rgba(0,0,0,0.06)",
  "0 14px 40px rgba(0,0,0,0.11), 0 7px 20px rgba(0,0,0,0.07)",
  "0 16px 44px rgba(0,0,0,0.11), 0 8px 22px rgba(0,0,0,0.07)",
  "0 16px 48px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.07)",
  "0 18px 52px rgba(0,0,0,0.12), 0 9px 26px rgba(0,0,0,0.08)",
  "0 20px 56px rgba(0,0,0,0.12), 0 10px 28px rgba(0,0,0,0.08)",
  "0 20px 60px rgba(0,0,0,0.13), 0 10px 30px rgba(0,0,0,0.08)",
  "0 22px 64px rgba(0,0,0,0.13), 0 11px 32px rgba(0,0,0,0.08)",
  "0 24px 68px rgba(0,0,0,0.13), 0 12px 34px rgba(0,0,0,0.09)",
  "0 24px 72px rgba(0,0,0,0.14), 0 12px 36px rgba(0,0,0,0.09)",
  "0 26px 76px rgba(0,0,0,0.14), 0 13px 38px rgba(0,0,0,0.09)",
  "0 28px 80px rgba(0,0,0,0.15), 0 14px 40px rgba(0,0,0,0.10)",
  "0 30px 84px rgba(0,0,0,0.15), 0 15px 42px rgba(0,0,0,0.10)",
  "0 32px 88px rgba(0,0,0,0.16), 0 16px 44px rgba(0,0,0,0.10)",
];

export function createAppTheme(mode: ColorMode): Theme {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  const scrollThumb = mode === "dark" ? "#334155" : "#CBD5E1";
  const scrollThumbHover = mode === "dark" ? "#475569" : "#94A3B8";
  const primaryMain = palette.primary.main;

  return createTheme({
    palette,
    typography,
    shape: { borderRadius: 12 },
    shadows,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
            backgroundColor: palette.background.default,
            transition: "background-color 200ms ease, color 200ms ease",
          },
          "*": { boxSizing: "border-box" },
          "::-webkit-scrollbar": { width: "6px", height: "6px" },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": { background: scrollThumb, borderRadius: "3px" },
          "::-webkit-scrollbar-thumb:hover": { background: scrollThumbHover },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            transition: "all 150ms ease",
            "&:active": { transform: "scale(0.98)" },
          },
          contained: {
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 6px 16px ${alpha(primaryMain, 0.25)}`,
            },
          },
          outlined: {
            borderWidth: "1.5px",
            "&:hover": { borderWidth: "1.5px" },
          },
          sizeSmall: { padding: "6px 14px", fontSize: "12px", borderRadius: "8px" },
          sizeMedium: { padding: "9px 20px" },
          sizeLarge: { padding: "12px 28px", fontSize: "14px" },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${palette.divider}`,
            borderRadius: "16px",
            backgroundImage: "none",
            transition: "all 200ms ease",
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: "11px", height: "22px", borderRadius: "6px" },
          label: { padding: "0 8px" },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "6px 12px",
            backgroundColor: mode === "dark" ? "#1E293B" : "#0F172A",
          },
          arrow: { color: mode === "dark" ? "#1E293B" : "#0F172A" },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "10px 12px",
            transition: "all 150ms ease",
            "&.Mui-selected": {
              backgroundColor: palette.sidebar.activeItemBg,
              color: primaryMain,
              "&:hover": { backgroundColor: palette.sidebar.activeItemBg },
            },
            "&:hover": { backgroundColor: palette.sidebar.hoverItemBg },
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: { fontWeight: 700, fontSize: "13px" },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: palette.divider },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: { borderRadius: "10px !important", fontSize: "14px" },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: palette.divider, borderWidth: "1.5px" },
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#475569" : "#94A3B8",
            },
          },
        },
      },
    },
  });
}

const theme = createAppTheme("light");

export default theme;
