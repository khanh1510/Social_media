import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tạo bản build standalone để đóng gói vào Docker image gọn nhẹ.
  // Coolify/Docker sẽ chạy `node server.js` từ thư mục .next/standalone.
  output: "standalone",
};

export default nextConfig;
