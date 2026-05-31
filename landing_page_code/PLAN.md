# Social Media Boost — Kế hoạch triển khai

> Tài liệu này mô tả thứ tự thực hiện từng bước, từ khởi tạo dự án đến hoàn thiện từng trang.
> Đọc kèm [DESIGN.md](./DESIGN.md) để tra cứu màu sắc, component, và layout chi tiết.

---

## Tổng quan các giai đoạn

```
Phase 1 — Setup & Foundation      (~1–2 giờ)
Phase 2 — Layout Shell             (~1 giờ)
Phase 3 — Trang chủ (Home)         (~3–4 giờ)
Phase 4 — Trang dịch vụ            (~2 giờ)
Phase 5 — Các trang phụ            (~2 giờ)
Phase 6 — Auth pages               (~1 giờ)
Phase 7 — Polish & QA              (~1–2 giờ)
```

---

## Phase 1 — Setup & Foundation

### Bước 1.1 — Khởi tạo project

```bash
npx create-next-app@latest social-media-boost \
  --typescript \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-tailwind
```

> Chọn `src/` directory để tách biệt rõ code với config gốc.

### Bước 1.2 — Cài dependencies

```bash
npm install \
  @mui/material@^6 \
  @mui/icons-material@^6 \
  @emotion/react@^11 \
  @emotion/styled@^11
```

Font Google Sans (fallback về Roboto vì Google Sans không public):

```html
<!-- app/layout.tsx <head> hoặc next/font -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Bước 1.3 — Tạo cấu trúc thư mục đầy đủ

Chạy lệnh hoặc tạo tay theo cây dưới:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── services/
│   │   └── [platform]/
│   │       └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── auth/
│       ├── login/
│       │   └── page.tsx
│       └── register/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── PlatformGrid.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FaqSection.tsx
│   │   └── CtaBanner.tsx
│   └── ui/
│       ├── PlatformCard.tsx
│       ├── StatCard.tsx
│       └── TestimonialCard.tsx
├── lib/
│   └── theme.ts
├── data/
│   ├── platforms.ts        # data tĩnh 4 nền tảng
│   ├── services.ts         # data gói dịch vụ
│   ├── testimonials.ts
│   └── faqs.ts
└── types/
    └── index.ts            # shared TypeScript types
```

**Lý do tách `data/`:** giữ component không chứa hardcode string; dễ sau này thay bằng API call.

### Bước 1.4 — Tạo `lib/theme.ts`

File này phải xong **trước khi code bất kỳ component nào** vì mọi màu sắc đều tham chiếu theme.

Nội dung đầy đủ theo DESIGN.md §7. Kết quả file:

```
src/lib/theme.ts   ← export const theme = createTheme({...})
```

### Bước 1.5 — Cấu hình `app/layout.tsx`

Đây là root layout, cần làm đúng ngay từ đầu:

- Import `ThemeProvider` + `CssBaseline` từ MUI
- Wrap `{children}` trong `ThemeProvider`
- Đặt `<CssBaseline />` để reset CSS mặc định
- Thêm `metadata` (title, description, Open Graph)
- Nhúng font

```tsx
// app/layout.tsx — thứ tự wrap:
<html>
  <body>
    <AppRouterCacheProvider>      {/* MUI + Next.js App Router */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  </body>
</html>
```

> **Lưu ý:** MUI v6 với Next.js App Router cần `@mui/material-nextjs` hoặc `AppRouterCacheProvider` từ `@mui/material/nextjs` để tránh style flash (FOUC).

```bash
npm install @mui/material-nextjs
```

### Bước 1.6 — Tạo `types/index.ts`

Định nghĩa các type dùng chung trước khi code component:

```ts
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

export interface ServicePackage {
  id: string
  name: string
  platform: Platform
  price: number
  quantity: number
  description: string
  popular?: boolean
}

export interface Testimonial {
  name: string
  role: string
  avatar: string
  rating: number
  content: string
  metric: string
}

export interface FaqItem {
  question: string
  answer: string
}
```

### Bước 1.7 — Tạo data tĩnh

Tạo `src/data/platforms.ts`, `services.ts`, `testimonials.ts`, `faqs.ts` với dữ liệu hardcode.
Các component sẽ import từ đây thay vì inline string.

---

## Phase 2 — Layout Shell

> Mục tiêu: có Header + Footer hiển thị đúng trên mọi trang trước khi build content.

### Bước 2.1 — `components/layout/Header.tsx`

Thứ tự build trong file:

1. Desktop nav: `AppBar` + `Toolbar` + logo text + menu `Button` links
2. Dropdown "Dịch vụ": `Menu` + `MenuItem` (4 platform)
3. Auth buttons: `Đăng nhập` (text) + `Đăng ký` (contained)
4. Mobile: thêm `IconButton` hamburger + `Drawer` + list nav

**Checklist Header:**
- [ ] Nền trắng, border-bottom `#E8EAED`
- [ ] Logo màu `#1A73E8`
- [ ] Links màu `#202124`, không có background highlight
- [ ] Sticky (`position="sticky" top={0}`)
- [ ] `zIndex: theme.zIndex.appBar`
- [ ] Mobile Drawer hoạt động

### Bước 2.2 — `components/layout/Footer.tsx`

1. Grid 4 cột: Logo+mô tả / Dịch vụ / Hỗ trợ / Liên hệ
2. Divider
3. Hàng dưới: copyright + logo thanh toán

**Checklist Footer:**
- [ ] Nền `#202124`
- [ ] Text phụ `#BDC1C6`, tiêu đề cột `#E8EAED`
- [ ] Link hover `#8AB4F8`
- [ ] Responsive: 4 cột → 2 cột → 1 cột

### Bước 2.3 — Gắn Header + Footer vào `app/layout.tsx`

```tsx
<Header />
<Box component="main" sx={{ minHeight: '100vh' }}>
  {children}
</Box>
<Footer />
```

Tạo một page placeholder tại `app/page.tsx` để kiểm tra layout chạy đúng trước khi qua Phase 3.

---

## Phase 3 — Trang chủ

> Build từng section theo thứ tự từ trên xuống. Sau mỗi section, reload browser kiểm tra.

### Bước 3.1 — UI atoms (`components/ui/`)

Build 3 component nhỏ này trước vì nhiều section dùng chung:

**`StatCard.tsx`**
- Props: `value`, `label`, `icon?`
- Layout: icon (tùy chọn) + số lớn (`#1A73E8`) + label (`#5F6368`)

**`PlatformCard.tsx`**
- Props: `platform`, `serviceCount`, `startingPrice`, `icon`
- Layout: avatar icon nền tảng + tên + badge "X dịch vụ" + giá từ + nút "Xem →"
- Hover: shadow nhẹ tăng lên

**`TestimonialCard.tsx`**
- Props: `name`, `role`, `avatar`, `rating`, `content`, `metric`
- Layout: `Avatar` + tên + chức danh + `Rating` + nội dung + chip metric

### Bước 3.2 — `HeroSection.tsx`

```
Nền: #E8F0FE (nhạt) hoặc #FFFFFF
Chip badge → H1 tiêu đề lớn → mô tả → 2 nút CTA → 3 stat mini
```

**Checklist:**
- [ ] Chip: `#E8F0FE` nền, `#1A73E8` text
- [ ] H1 dùng `variant="h1"` của theme (2.75rem, 700)
- [ ] Nút "Bắt đầu ngay": `variant="contained"`
- [ ] Nút "Xem dịch vụ": `variant="outlined"`
- [ ] 3 stat nhỏ dưới cùng bố cục inline

### Bước 3.3 — `StatsBar.tsx`

```
Paper nền trắng, border, shadow nhẹ
Grid 4 cột → 2 cột (mobile)
Map qua data → render StatCard
```

### Bước 3.4 — `PlatformGrid.tsx`

```
Section nền #F8F9FA
Tiêu đề section + mô tả
Grid 4 cột → 2 cột → 1 cột
Map qua platforms data → render PlatformCard
```

### Bước 3.5 — `HowItWorks.tsx`

```
Section nền #FFFFFF
4 bước dạng Grid hoặc Stepper
Mỗi bước: vòng tròn số (#1A73E8) + tiêu đề + mô tả
Mũi tên nối giữa các bước (ẩn trên mobile)
```

### Bước 3.6 — `FeaturesSection.tsx`

```
Section nền #F8F9FA
6 card icon: Grid 3 cột → 2 cột → 1 cột
Mỗi card: icon MUI + tiêu đề + mô tả ngắn
```

### Bước 3.7 — `TestimonialsSection.tsx`

```
Section nền #FFFFFF
3 TestimonialCard dạng Grid
```

### Bước 3.8 — `FaqSection.tsx`

```
Section nền #F8F9FA
Accordion list 6–8 câu hỏi từ data/faqs.ts
```

### Bước 3.9 — `CtaBanner.tsx`

```
Nền #E8F0FE
Tiêu đề màu #1A73E8 + mô tả + 2 nút
```

### Bước 3.10 — Lắp ráp `app/page.tsx`

```tsx
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <PlatformGrid />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </>
  )
}
```

---

## Phase 4 — Trang dịch vụ

### Bước 4.1 — `app/services/[platform]/page.tsx`

Dynamic route, nhận `params.platform`.

**Layout trang:**
```
Breadcrumb: Trang chủ > Dịch vụ > Instagram
Tiêu đề trang + icon nền tảng
Grid gói dịch vụ (lọc theo platform từ data/services.ts)
CTA Banner
```

**Mỗi gói dịch vụ (ServicePackage card):**
```
Tên gói | Số lượng | Giá | [Đặt ngay]
Badge "Phổ biến" nếu popular: true
```

### Bước 4.2 — Validate route

Trong `generateStaticParams` trả về 4 platform để Next.js pre-render:

```ts
export function generateStaticParams() {
  return [
    { platform: 'instagram' },
    { platform: 'tiktok' },
    { platform: 'youtube' },
    { platform: 'facebook' },
  ]
}
```

---

## Phase 5 — Các trang phụ

Các trang này đơn giản hơn, build nhanh:

### Bước 5.1 — `app/blog/page.tsx`

```
Tiêu đề trang
Grid card bài viết (dữ liệu tĩnh tạm thời)
Mỗi card: ảnh thumbnail + tiêu đề + ngày + excerpt + link đọc thêm
```

### Bước 5.2 — `app/about/page.tsx`

```
Hero text: tên công ty + slogan
Mission section
Team section (nếu có)
Stats (cùng StatsBar component tái dùng)
CTA Banner
```

### Bước 5.3 — `app/contact/page.tsx`

```
Grid 2 cột:
  Trái: thông tin liên hệ (địa chỉ, email, hotline, Zalo)
  Phải: form (TextField x4 + Button submit)
MUI form: TextField + Select + Button
Validation cơ bản (required fields)
```

---

## Phase 6 — Auth pages

### Bước 6.1 — `app/auth/login/page.tsx`

```
Card căn giữa trang (max-width 440px)
Logo + tiêu đề "Đăng nhập"
TextField Email + TextField Password (type="password")
Link "Quên mật khẩu?"
Button "Đăng nhập" (contained, full width)
Divider "hoặc"
Link "Chưa có tài khoản? Đăng ký"
```

### Bước 6.2 — `app/auth/register/page.tsx`

```
Card căn giữa (max-width 480px)
TextField: Họ tên + Email + Số điện thoại + Mật khẩu + Xác nhận MK
Checkbox đồng ý điều khoản
Button "Tạo tài khoản" (contained, full width)
Link "Đã có tài khoản? Đăng nhập"
```

---

## Phase 7 — Polish & QA

### Bước 7.1 — Responsive check

Kiểm tra từng trang ở 3 breakpoint:

| Trang | xs (390px) | md (768px) | lg (1280px) |
|---|---|---|---|
| Trang chủ | [ ] | [ ] | [ ] |
| Dịch vụ | [ ] | [ ] | [ ] |
| Blog | [ ] | [ ] | [ ] |
| About | [ ] | [ ] | [ ] |
| Contact | [ ] | [ ] | [ ] |
| Login | [ ] | [ ] | [ ] |
| Register | [ ] | [ ] | [ ] |

### Bước 7.2 — SEO metadata

Mỗi `page.tsx` cần export `metadata`:

```ts
export const metadata: Metadata = {
  title: 'Tăng follow Instagram giá rẻ | SocialBoost VN',
  description: '...',
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-image.png'],
  },
}
```

### Bước 7.3 — Performance

- Thay tất cả `<img>` bằng `next/image`
- Thêm `loading="lazy"` cho ảnh below-the-fold
- Kiểm tra Lighthouse score (target: Performance > 85)

### Bước 7.4 — Kiểm tra theme nhất quán

Rà soát toàn bộ component, đảm bảo:
- [ ] Không có hardcode màu hex nào nằm ngoài `theme.ts`
- [ ] Không dùng gradient đậm
- [ ] Text đen `#202124` — không dùng `#1A237E` hay màu bão hòa khác
- [ ] Button không có shadow cố định

---

## Thứ tự file cần tạo (chronological)

Đây là thứ tự ưu tiên tạo file từ đầu đến cuối:

```
1.  src/lib/theme.ts
2.  src/types/index.ts
3.  src/data/platforms.ts
4.  src/data/services.ts
5.  src/data/testimonials.ts
6.  src/data/faqs.ts
7.  src/app/layout.tsx
8.  src/app/globals.css
9.  src/components/layout/Header.tsx
10. src/components/layout/Footer.tsx
11. src/components/ui/StatCard.tsx
12. src/components/ui/PlatformCard.tsx
13. src/components/ui/TestimonialCard.tsx
14. src/components/home/HeroSection.tsx
15. src/components/home/StatsBar.tsx
16. src/components/home/PlatformGrid.tsx
17. src/components/home/HowItWorks.tsx
18. src/components/home/FeaturesSection.tsx
19. src/components/home/TestimonialsSection.tsx
20. src/components/home/FaqSection.tsx
21. src/components/home/CtaBanner.tsx
22. src/app/page.tsx
23. src/app/services/[platform]/page.tsx
24. src/app/blog/page.tsx
25. src/app/about/page.tsx
26. src/app/contact/page.tsx
27. src/app/auth/login/page.tsx
28. src/app/auth/register/page.tsx
```

---

## Dependencies cần cài

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@mui/material": "^6.0.0",
    "@mui/icons-material": "^6.0.0",
    "@mui/material-nextjs": "^6.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@emotion/cache": "^11.13.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0"
  }
}
```

---

## Ghi chú quan trọng

**MUI + Next.js App Router:** phải dùng `AppRouterCacheProvider` để tránh FOUC (flash of unstyled content). Đây là lỗi hay gặp nhất khi dùng MUI v6 với App Router.

**Server vs Client component:** MUI components cần `"use client"`. Các page và layout có thể là Server Component, nhưng component con dùng MUI phải thêm directive này.

**`src/` directory:** tất cả code nằm trong `src/`, các file config (`next.config.ts`, `tsconfig.json`, `package.json`) nằm ở root.
