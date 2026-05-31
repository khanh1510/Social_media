import { createTheme, alpha } from "@mui/material/styles";

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
  }
}

const baseTheme = createTheme();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    info: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0284C7",
    },
    warning: {
      main: "#06B6D4",
      light: "#22D3EE",
      dark: "#0891B2",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#CBD5E1",
    },
    divider: "#E2E8F0",
    sidebar: {
      bg: "#FFFFFF",
      border: "#E2E8F0",
      text: "#0F172A",
      textMuted: "#64748B",
      activeItemBg: alpha("#2563EB", 0.08),
      hoverItemBg: alpha("#0F172A", 0.04),
    },
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
    h4: {
      fontSize: "22px",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "15px",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    overline: {
      fontSize: "10px",
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: "0.1em",
    },
    button: {
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
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
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
          backgroundColor: "#F8FAFC",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#CBD5E1",
          borderRadius: "3px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#94A3B8",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "13px",
          transition: "all 150ms ease",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        contained: {
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
        sizeSmall: {
          padding: "6px 14px",
          fontSize: "12px",
          borderRadius: "8px",
        },
        sizeMedium: {
          padding: "9px 20px",
        },
        sizeLarge: {
          padding: "12px 28px",
          fontSize: "14px",
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          transition: "all 200ms ease",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "11px",
          height: "22px",
          borderRadius: "6px",
        },
        label: {
          padding: "0 8px",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "12px",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "6px 12px",
          backgroundColor: "#0F172A",
        },
        arrow: {
          color: "#0F172A",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "10px 12px",
          transition: "all 150ms ease",
          "&.Mui-selected": {
            backgroundColor: alpha("#2563EB", 0.08),
            color: "#2563EB",
            "&:hover": {
              backgroundColor: alpha("#2563EB", 0.12),
            },
          },
          "&:hover": {
            backgroundColor: alpha("#0F172A", 0.04),
          },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "13px",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E2E8F0",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "10px !important",
          fontSize: "14px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#E2E8F0",
          borderWidth: "1.5px",
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8",
          },
        },
      },
    },
  },
});

export default theme;
