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
  title: "SignalGit — Dashboard",
  description: "Social media services management dashboard",
};

// Chạy trước khi React hydrate: đọc mode đã lưu (hoặc preference hệ thống) và
// đặt nền + colorScheme ngay để tránh chớp sáng (FOUC) khi đang ở chế độ tối.
const themeInitScript = `
(function() {
  try {
    var m = localStorage.getItem('color-mode');
    if (m !== 'light' && m !== 'dark') {
      m = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var d = document.documentElement;
    d.setAttribute('data-theme', m);
    d.style.colorScheme = m;
    d.style.backgroundColor = m === 'dark' ? '#0B1120' : '#F8FAFC';
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <EmotionRegistry>
          <AuthProvider>{children}</AuthProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
