import type { Metadata } from "next";
import { Inter } from "next/font/google";
import EmotionRegistry from "@/theme/EmotionRegistry";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

// Inter: variable font (đủ weight 100–900), có subset tiếng Việt
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SocialMedia.vn — Bảng Điều Khiển",
  description: "Bảng điều khiển quản lý dịch vụ mạng xã hội",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <EmotionRegistry>
          <AuthProvider>{children}</AuthProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
