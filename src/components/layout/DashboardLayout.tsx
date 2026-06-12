"use client";

import { Box, CircularProgress, Drawer } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar, { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Chưa đăng nhập → về /login (token nằm ở localStorage nên guard phía client)
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const desktopWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Desktop sidebar */}
      <AppSidebar collapsed={collapsed} />

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <AppSidebar collapsed={false} onClose={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { md: `${desktopWidth}px` },
          transition: "margin-left 250ms ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppHeader
          onMobileMenuOpen={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          collapsed={collapsed}
        />
        <Box sx={{ flex: 1, mt: "60px", p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
