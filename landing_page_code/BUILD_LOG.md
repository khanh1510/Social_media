# BUILD LOG — Social Media Boost

> Ghi lại toàn bộ quá trình thực thi từ PLAN.md. Cập nhật theo thứ tự thời gian.

---

## Phase 1 — Setup & Foundation ✅

**Ngày:** 27/05/2026

### Bước 1.1 — Khởi tạo Next.js project
- **Lệnh:** `npx create-next-app@latest` với TypeScript, App Router, `src/` dir
- **Kết quả:** Next.js **16.2.6** được cài (mới hơn 14 trong PLAN — không ảnh hưởng logic)
- **Ghi chú:** Phải tạo trong folder tạm `smb-temp` rồi copy ra vì thư mục gốc đã có `DESIGN.md`, `PLAN.md`

### Bước 1.2 — Cài dependencies
- **Lệnh:** `npm install @mui/material@^6 @mui/icons-material@^6 @mui/material-nextjs@^6 @emotion/react @emotion/styled @emotion/cache`
- **Kết quả:** MUI **6.5.0** cài thành công
- **Ghi chú:** Cần `--legacy-peer-deps` vì `@mui/material-nextjs` chưa cập nhật peer dep cho Next.js 16

### Bước 1.3 — Cấu trúc thư mục
Tạo đầy đủ theo PLAN.md:
```
src/components/layout/    src/components/home/    src/components/ui/
src/data/                 src/types/              src/app/services/[platform]/
src/app/blog/             src/app/about/          src/app/contact/
src/app/auth/login/       src/app/auth/register/
```

### Bước 1.4 — Files foundation tạo
| File | Nội dung |
|---|---|
| `src/lib/theme.ts` | MUI theme Google-style (palette, typography, component overrides) |
| `src/types/index.ts` | TypeScript types: Platform, ServicePackage, Testimonial, FaqItem, BlogPost |
| `src/data/platforms.ts` | 4 platforms: Instagram, TikTok, YouTube, Facebook |
| `src/data/services.ts` | 17 gói dịch vụ + helper `getServicesByPlatform()` |
| `src/data/testimonials.ts` | 3 testimonials |
| `src/data/faqs.ts` | 8 FAQ items |

### Bước 1.5 — `app/layout.tsx`
- Wrap với `AppRouterCacheProvider` + `ThemeProvider` + `CssBaseline`
- SEO metadata đầy đủ (title, description, keywords, OpenGraph)
- Font Be Vietnam Pro từ Google Fonts
- Gắn `<Header />` + `<Footer />` vào root layout

---

## Phase 2 — Layout Shell ✅

### Header (`src/components/layout/Header.tsx`)
- AppBar nền trắng, border-bottom `#E8EAED`
- Logo `SocialBoost VN` màu `primary.main` (#1A73E8)
- Desktop nav: Trang chủ, Dịch vụ (dropdown Menu 4 platform), Blog, Giới thiệu, Liên hệ
- Auth: nút text "Đăng nhập" + contained "Đăng ký"
- Mobile: Drawer với hamburger icon

### Footer (`src/components/layout/Footer.tsx`)
- Nền `#202124` (Google dark grey)
- 4 cột: Brand / Dịch vụ / Hỗ trợ / Liên hệ
- Payment logos: Visa, MasterCard, Momo, ZaloPay, VNPay
- Copyright + divider

---

## Phase 3 — Trang chủ ✅

### UI Atoms
| Component | File |
|---|---|
| `StatCard` | `src/components/ui/StatCard.tsx` |
| `PlatformCard` | `src/components/ui/PlatformCard.tsx` |
| `TestimonialCard` | `src/components/ui/TestimonialCard.tsx` |

### Sections (thứ tự trong `app/page.tsx`)
| # | Component | Nền | Nội dung |
|---|---|---|---|
| 1 | `HeroSection` | `#E8F0FE` | Chip badge + H1 + mô tả + 2 CTA buttons + 3 mini stats |
| 2 | `StatsBar` | `#FFFFFF` | 4 StatCard: 120K+ KH / 10M+ Seeds / 4 Nền tảng / 99.8% |
| 3 | `PlatformGrid` | `#F8F9FA` | 4 PlatformCard grid |
| 4 | `HowItWorks` | `#FFFFFF` | 4 bước với step number circles |
| 5 | `FeaturesSection` | `#F8F9FA` | 6 feature cards với MUI icons |
| 6 | `TestimonialsSection` | `#FFFFFF` | 3 TestimonialCard |
| 7 | `FaqSection` | `#F8F9FA` | 8 Accordion items |
| 8 | `CtaBanner` | `#E8F0FE` | CTA text + 2 buttons |

---

## Phase 4 — Trang dịch vụ ✅

### `src/app/services/[platform]/page.tsx`
- Server Component với `generateStaticParams` cho 4 platforms
- `generateMetadata` dynamic theo platform
- Breadcrumbs: Trang chủ → Dịch vụ → [Platform]
- Grid card gói dịch vụ với badge "Phổ biến nhất"
- Tái dùng `CtaBanner`

---

## Phase 5 — Trang phụ ✅

| Trang | File | Ghi chú |
|---|---|---|
| Blog | `src/app/blog/page.tsx` | 6 bài viết tĩnh, card grid |
| Giới thiệu | `src/app/about/page.tsx` | Hero + StatsBar (tái dùng) + 4 value cards + CtaBanner |
| Liên hệ | `src/app/contact/page.tsx` | 2 cột: contact info + form (TextField, Select, Button) |

---

## Phase 6 — Auth Pages ✅

| Trang | File | Fields |
|---|---|---|
| Đăng nhập | `src/app/auth/login/page.tsx` | Email + Password + Quên mật khẩu link |
| Đăng ký | `src/app/auth/register/page.tsx` | Tên + Email + SĐT + Password + Confirm + Checkbox terms |

---

## Sự cố & Cách xử lý

### 1. Grid `size` prop không tồn tại (MUI 6.5.0)
- **Vấn đề:** MUI v6 `Grid` cũ không có prop `size={{ xs, sm, md }}` — chỉ có Grid2
- **Fix:** Đổi import sang `@mui/material/Grid2` (stable trong MUI 6.5)
- **Ảnh hưởng:** 10 files

### 2. `Unstable_Grid2` không tồn tại
- **Vấn đề:** Agent đề xuất dùng `@mui/material/Unstable_Grid2` nhưng path này không có trong MUI 6.5
- **Fix:** Đổi sang `@mui/material/Grid2`

### 3. Server Component không nhận `component={NextLink}`
- **Vấn đề:** Next.js 16 không cho pass function (component prop) từ Server Component xuống Client Component khi serializing props cho static generation
- **Fix:** Thay `<Link component={NextLink}>` bằng `<NextLink>` trực tiếp trong Server Components
- **Files:** `app/blog/page.tsx`, `app/services/[platform]/page.tsx`

### 4. Encoding lỗi sau khi agent sửa file
- **Vấn đề:** PowerShell ghi file bằng encoding cũ làm corrupt tiếng Việt
- **Fix:** Viết lại file bằng `Write` tool với encoding UTF-8 đúng

---

## Kết quả build cuối cùng

```
Route (app)                 Type
/                           ○ Static
/_not-found                 ○ Static
/about                      ○ Static
/auth/login                 ○ Static
/auth/register              ○ Static
/blog                       ○ Static
/contact                    ○ Static
/services/[platform]        ● SSG
  /services/instagram
  /services/tiktok
  /services/youtube
  /services/facebook

✓ 13/13 pages generated
✓ TypeScript: 0 errors
✓ Build: thành công
```

---

## Để chạy project

```bash
npm run dev    # Development server tại http://localhost:3000
npm run build  # Production build
npm run start  # Chạy production build
```

---

## Còn lại (chưa thực hiện)

- [ ] **Phase 7 — Polish:** Responsive kiểm tra thực tế trên browser
- [ ] **SEO:** Bổ sung `sitemap.xml`, `robots.txt`
- [ ] **Hình ảnh:** Thay placeholder bằng ảnh thật với `next/image`
- [ ] **Form handling:** Kết nối form liên hệ với API / email service
- [ ] **Auth logic:** Kết nối login/register với backend
- [ ] **Trang 404:** Custom not-found page
- [ ] **Blog detail:** `app/blog/[slug]/page.tsx`
