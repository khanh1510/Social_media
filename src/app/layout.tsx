import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import EmotionRegistry from "@/theme/EmotionRegistry";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "SocialMedia.vn — Bảng Điều Khiển",
  description: "Bảng điều khiển quản lý dịch vụ mạng xã hội",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  );
}
