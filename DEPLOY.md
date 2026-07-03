# Deploy Frontend lên Coolify + CI/CD

Frontend (`socialmedia-dashboard`, Next.js 16) deploy lên **web.signalgit.com**.
API đã có sẵn tại **api.signalgit.com**.

Cách hoạt động: push lên `main` → GitHub Actions lint + build check → gọi Coolify webhook → Coolify build image từ `Dockerfile` và deploy.

---

## Bước 1 — Tạo Application trên Coolify

1. Vào Coolify → **Project** → **+ New Resource** → **Public/Private Repository** (chọn repo `khanh1510/Social_media`).
2. **Branch:** `main`
3. **Build Pack:** chọn **Dockerfile**
4. **Base Directory / Dockerfile Location:** để mặc định `/` (Dockerfile nằm ở root repo). Nếu Coolify hỏi Dockerfile path → `Dockerfile`.
5. **Port (Ports Exposes):** `3001`

## Bước 2 — Biến môi trường trên Coolify

Vào tab **Environment Variables** của application, thêm:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `NEXT_PUBLIC_API_URL` | `https://api.signalgit.com` | **Bật "Build Variable / Available at Buildtime"** — vì `NEXT_PUBLIC_*` được nhúng lúc build. |

> Quan trọng: `NEXT_PUBLIC_API_URL` PHẢI được đánh dấu là build-time variable, nếu không giá trị sẽ không vào bundle. Trong Dockerfile đã có `ARG NEXT_PUBLIC_API_URL`; Coolify tự truyền build arg từ biến build-time.

## Bước 3 — Domain

1. Tab **Domains** của application → nhập: `https://web.signalgit.com`
2. Trỏ DNS: tạo bản ghi **A** `web` → IP server Coolify (giống cách đã làm với `api`).
3. Coolify tự cấp SSL (Let's Encrypt).

## Bước 4 — Deploy lần đầu (thủ công)

Bấm **Deploy** trên Coolify để build & chạy lần đầu, xác nhận web lên được tại https://web.signalgit.com.

## Bước 5 — Lấy Coolify Deploy Webhook

1. Tab **Webhooks** (hoặc **Deploy webhook**) của application → copy URL webhook, dạng:
   `https://<coolify-host>/api/v1/deploy?uuid=<APP_UUID>&force=false`
2. Tạo API token: Coolify → **Keys & Tokens / API Tokens** → tạo token (quyền deploy).

## Bước 6 — Thêm Secrets/Variables trên GitHub

Repo GitHub `khanh1510/Social_media` → **Settings → Secrets and variables → Actions**:

**Secrets:**
| Name | Value |
|------|-------|
| `COOLIFY_WEBHOOK` | URL webhook ở Bước 5 |
| `COOLIFY_TOKEN` | API token ở Bước 5 |

**Variables** (tab "Variables"):
| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.signalgit.com` |

> `NEXT_PUBLIC_API_URL` dạng *variable* (không phải secret) chỉ dùng cho bước "build check" trong CI cho sát production; deploy thật do Coolify build.

## Bước 7 — Bật CI/CD

Push code lên `main`. GitHub Actions (`.github/workflows/deploy.yml`) sẽ:
1. `npm ci` → `npm run lint` → `npm run build` (build check)
2. Nếu pass → gọi Coolify webhook → Coolify tự pull, build Dockerfile, deploy.

Xem tiến trình ở tab **Actions** của repo và log build ở Coolify.

---

## Ghi chú

- App chạy port **3001** (khớp `next start -p 3001` và `ENV PORT=3001` trong Dockerfile).
- Sửa API URL sau này: đổi cả biến trên Coolify (build-time) lẫn GitHub Variable, rồi redeploy.
- Nếu không muốn dùng GitHub Actions, có thể để Coolify tự động deploy qua GitHub App khi push (bỏ workflow đi).
