# Social Media Boost — Tài liệu thiết kế

## 1. Tổng quan dự án

Nền tảng cung cấp dịch vụ tăng tương tác mạng xã hội (seeding) cho các nền tảng phổ biến tại Việt Nam: Instagram, TikTok, YouTube, Facebook.

**Stack:**
- Framework: Next.js 14 (App Router)
- UI Design System: Material Design 3 (Google) — thư viện `@mui/material` v6
- Language: TypeScript
- Styling: MUI `sx` prop + `theme` customization

---

## 2. Màu sắc & Typography

### Màu chủ đạo (Google-style — tinh tế, không sặc sỡ)

Lấy cảm hứng từ Google Search, Google Workspace, Google One: xanh dương trung tính, nền trắng/xám rất nhạt, text gần đen. Tránh dùng gradient đậm và màu bão hòa cao.

| Token | Hex | Dùng cho |
|---|---|---|
| `primary` | `#1A73E8` | Button, link, highlight (Google Blue) |
| `primary.light` | `#4285F4` | Hover state, badge nhạt |
| `primary.dark` | `#1557B0` | Active state, focus ring |
| `secondary` | `#34A853` | Trạng thái thành công, badge tích cực (Google Green) |
| `error` | `#D93025` | Thông báo lỗi (Google Red) |
| `warning` | `#F29900` | Cảnh báo nhẹ (Google Yellow) |
| `background.default` | `#F8F9FA` | Nền trang (Google grey-50) |
| `background.paper` | `#FFFFFF` | Card, modal |
| `surface` | `#F1F3F4` | Section nền xen kẽ, input background |
| `text.primary` | `#202124` | Tiêu đề, nội dung chính (gần đen) |
| `text.secondary` | `#5F6368` | Mô tả, phụ đề (Google grey-700) |
| `text.disabled` | `#9AA0A6` | Placeholder, disabled state |
| `divider` | `#E8EAED` | Border, đường kẻ phân cách |

### Typography (MUI theme override)

```ts
typography: {
  fontFamily: '"Be Vietnam Pro", "Roboto", sans-serif',
  h1: { fontSize: '3rem',   fontWeight: 800 },
  h2: { fontSize: '2.25rem', fontWeight: 700 },
  h3: { fontSize: '1.75rem', fontWeight: 700 },
  h4: { fontSize: '1.375rem', fontWeight: 600 },
  body1: { fontSize: '1rem',   lineHeight: 1.7 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
}
```

---

## 3. Cấu trúc thư mục (Next.js App Router)

```
social-media-boost/
├── app/
│   ├── layout.tsx               # Root layout + MUI ThemeProvider
│   ├── page.tsx                 # Trang chủ
│   ├── services/
│   │   └── [platform]/page.tsx  # Trang dịch vụ theo nền tảng
│   ├── blog/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── auth/
│       ├── login/page.tsx
│       └── register/page.tsx
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
│   │   └── FaqSection.tsx
│   └── ui/
│       ├── PlatformCard.tsx
│       ├── StatCard.tsx
│       └── TestimonialCard.tsx
├── lib/
│   └── theme.ts                 # MUI custom theme
├── public/
│   └── images/
└── ...config files
```

---

## 4. Các trang & route

| Route | Trang | Mô tả |
|---|---|---|
| `/` | Trang chủ | Landing page đầy đủ sections |
| `/services/instagram` | Dịch vụ Instagram | Danh sách gói dịch vụ |
| `/services/tiktok` | Dịch vụ TikTok | Danh sách gói dịch vụ |
| `/services/youtube` | Dịch vụ YouTube | Danh sách gói dịch vụ |
| `/services/facebook` | Dịch vụ Facebook | Danh sách gói dịch vụ |
| `/blog` | Blog | Danh sách bài viết |
| `/about` | Giới thiệu | Thông tin công ty |
| `/contact` | Liên hệ | Form liên hệ |
| `/auth/login` | Đăng nhập | Form đăng nhập |
| `/auth/register` | Đăng ký | Form đăng ký |

---

## 5. Thiết kế từng section (Trang chủ)

### 5.1 Header / Navbar

- **Component MUI:** `AppBar` + `Toolbar` + `Button`
- Sticky, nền trắng `#FFFFFF` + border-bottom `#E8EAED` + shadow cực nhẹ (`0 1px 3px rgba(0,0,0,0.08)`)
- Logo bên trái (text hoặc SVG — màu `#1A73E8`)
- Menu links: màu `#202124`, hover underline `#1A73E8` — không dùng background highlight
- Bên phải: nút `Đăng nhập` (text button, màu `#1A73E8`) + `Đăng ký` (contained, `#1A73E8`)
- Mobile: `Drawer` với `IconButton` hamburger

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]   Trang chủ  Dịch vụ ▾  Blog  Giới thiệu  Liên hệ  [Đăng nhập] [Đăng ký] │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.2 Hero Section

- **Component MUI:** `Box` + `Container` + `Grid` + `Typography` + `Button` + `Chip`
- Nền: `#FFFFFF` hoặc `#F8F9FA` — không dùng gradient đậm
- Accent duy nhất: text `#1A73E8`, icon tròn nhỏ màu primary
- Text tiêu đề: `#202124`, mô tả: `#5F6368`
- Nếu cần nổi bật: dùng một dải màu `#E8F0FE` (Google blue-50) rất nhạt làm nền hero thay vì gradient đậm

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  [Chip: TOP 1 SEEDING VN ⭐]                                  │
│                                                              │
│  Tăng Tương Tác Mạng Xã Hội                                  │
│  Nhanh & Giá Tốt Nhất                                       │
│                                                              │
│  Mô tả ngắn về dịch vụ...                                   │
│                                                              │
│  [Bắt đầu ngay →]  [Xem dịch vụ]                            │
│                                                              │
│  ⭐ 4.9/5   👥 120K+ Khách hàng   ✅ 99.8% Thành công        │
└──────────────────────────────────────────────────────────────┘
```

---

### 5.3 Stats Bar

- **Component MUI:** `Paper` + `Grid` + `Typography`
- Nền trắng, shadow nhẹ
- 4 chỉ số: Khách hàng / Seeds / Nền tảng / Tỷ lệ thành công

```
┌──────────┬──────────┬──────────┬──────────┐
│ 120K+    │ 10M+     │  4       │ 99.8%    │
│ Khách    │ Seeds    │ Nền tảng │ Thành    │
│ hàng     │          │          │ công     │
└──────────┴──────────┴──────────┴──────────┘
```

---

### 5.4 Platform Grid (Dịch vụ theo nền tảng)

- **Component MUI:** `Grid` + `Card` + `CardContent` + `Avatar` + `Chip`
- 4 card: Instagram / TikTok / YouTube / Facebook
- Mỗi card: icon nền tảng + tên + số dịch vụ + giá từ + nút CTA

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 📸       │  │ 🎵       │  │ ▶️        │  │ 👥       │
│ Instagram│  │ TikTok   │  │ YouTube  │  │ Facebook │
│ 12 dịch  │  │ 8 dịch   │  │ 10 dịch  │  │ 15 dịch  │
│ vụ       │  │ vụ       │  │ vụ       │  │ vụ       │
│ Từ 5.000đ│  │ Từ 3.000đ│  │ Từ 8.000đ│  │ Từ 2.000đ│
│ [Xem →]  │  │ [Xem →]  │  │ [Xem →]  │  │ [Xem →]  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

### 5.5 How It Works (4 bước)

- **Component MUI:** `Stepper` (horizontal) hoặc `Grid` + `Paper`
- Nền `#F8F9FA` (surface xen kẽ với section trắng)
- Icon số bước: vòng tròn màu `#1A73E8`, text trắng; tiêu đề `#202124`, mô tả `#5F6368`

```
  [1]          [2]           [3]          [4]
Đăng ký  →  Nạp tiền  →  Đặt đơn  →  Theo dõi
```

---

### 5.6 Features Section

- **Component MUI:** `Grid` + `Card` + `SvgIcon` + `Typography`
- 6 tính năng dạng icon card:

| Icon | Tính năng |
|---|---|
| ⚡ | Giao hàng tức thì |
| 👤 | Tương tác thực |
| 🕐 | Hỗ trợ 24/7 |
| 💰 | Giá cạnh tranh |
| 🔒 | An toàn tài khoản |
| 🔄 | Hoàn tiền đảm bảo |

---

### 5.7 Testimonials Section

- **Component MUI:** `Card` + `Avatar` + `Rating` + `Typography`
- 3 testimonial card dạng horizontal scroll hoặc grid
- Mỗi card: avatar + tên + chức danh + rating + nội dung + số liệu tăng trưởng

---

### 5.8 FAQ Section

- **Component MUI:** `Accordion` + `AccordionSummary` + `AccordionDetails`
- 6–8 câu hỏi thường gặp
- Nền trắng, expand/collapse animation

---

### 5.9 CTA Banner

- **Component MUI:** `Box` + `Typography` + `Button`
- Nền `#E8F0FE` (Google blue-50) — xanh dương rất nhạt, không dùng gradient đậm
- Tiêu đề màu `#1A73E8`, mô tả `#202124`
- 2 nút: contained `#1A73E8` + outlined `#1A73E8`

---

### 5.10 Footer

- **Component MUI:** `Box` + `Grid` + `Link` + `Divider`
- Nền `#202124` (Google dark grey — không đen tuyệt đối, không navy sặc sỡ)
- Text: `#BDC1C6` (phụ đề), `#E8EAED` (tiêu đề cột), link hover `#8AB4F8` (Google blue nhạt trên nền tối)
- 4 cột: Logo & mô tả / Dịch vụ / Hỗ trợ / Liên hệ
- Hàng cuối: copyright + logo thanh toán (Visa, MasterCard, Momo, ZaloPay)

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]           Dịch vụ      Hỗ trợ       Liên hệ         │
│  Mô tả công ty    Instagram    FAQ           Email           │
│                   TikTok       Blog          Hotline         │
│                   YouTube      Điều khoản    Zalo            │
│                   Facebook     Chính sách                    │
│──────────────────────────────────────────────────────────────│
│  © 2024 SocialBoost VN   [Visa] [MC] [Momo] [ZaloPay]       │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Components tái sử dụng

### `PlatformCard`
```tsx
interface PlatformCardProps {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook'
  serviceCount: number
  startingPrice: number
  icon: ReactNode
}
```

### `StatCard`
```tsx
interface StatCardProps {
  value: string   // "120K+"
  label: string   // "Khách hàng"
  icon?: ReactNode
}
```

### `TestimonialCard`
```tsx
interface TestimonialCardProps {
  name: string
  role: string
  avatar: string
  rating: number
  content: string
  metric: string  // "+15K followers"
}
```

---

## 7. MUI Theme config (tóm tắt)

```ts
// lib/theme.ts
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main:  '#1A73E8',  // Google Blue
      light: '#4285F4',
      dark:  '#1557B0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#34A853',   // Google Green — thành công, tích cực
      contrastText: '#FFFFFF',
    },
    error:   { main: '#D93025' },  // Google Red
    warning: { main: '#F29900' },  // Google Yellow
    background: {
      default: '#F8F9FA',  // Google grey-50
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#202124',  // gần đen — Google standard
      secondary: '#5F6368',  // Google grey-700
      disabled:  '#9AA0A6',
    },
    divider: '#E8EAED',
  },
  typography: {
    fontFamily: '"Google Sans", "Be Vietnam Pro", "Roboto", sans-serif',
    h1: { fontSize: '2.75rem', fontWeight: 700, color: '#202124' },
    h2: { fontSize: '2rem',    fontWeight: 700, color: '#202124' },
    h3: { fontSize: '1.5rem',  fontWeight: 600, color: '#202124' },
    h4: { fontSize: '1.25rem', fontWeight: 600, color: '#202124' },
    body1: { fontSize: '1rem',    lineHeight: 1.6, color: '#202124' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#5F6368' },
  },
  shape: {
    borderRadius: 8,  // Google dùng 4–8px, tránh bo tròn quá nhiều
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#1A73E8',
          '&:hover': { backgroundColor: '#1557B0' },
        },
        outlinedPrimary: {
          borderColor: '#1A73E8',
          color: '#1A73E8',
          '&:hover': { backgroundColor: '#E8F0FE' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #E8EAED',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.10)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#202124',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #E8EAED',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4 },
        colorPrimary: { backgroundColor: '#E8F0FE', color: '#1A73E8' },
      },
    },
  },
})
```

### Nguyên tắc màu sắc (Google-style)

- **Không dùng gradient đậm** cho hero hay banner — thay bằng nền trắng hoặc `#E8F0FE`
- **Màu chủ đạo xuất hiện ít thôi** — chỉ trên button, link, icon accent; phần lớn UI là trắng/xám
- **Tương phản text** luôn dùng `#202124` trên nền sáng, không dùng `#1A237E` hay màu đậm bão hòa
- **Card** dùng border thay vì shadow nặng; hover mới tăng shadow nhẹ
- **Section xen kẽ** dùng `#F8F9FA` ↔ `#FFFFFF`, không xen màu đậm

---

## 8. Responsive Breakpoints

Theo chuẩn MUI:

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` | 0–600px | 1 cột, hamburger menu |
| `sm` | 600–900px | 2 cột |
| `md` | 900–1200px | 3–4 cột |
| `lg` | 1200px+ | Layout đầy đủ |

---

## 9. Dependencies chính

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "@mui/material": "^6.0.0",
    "@mui/icons-material": "^6.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "typescript": "^5.5.0"
  }
}
```

---

## 10. Checklist trước khi code

- [ ] Khởi tạo Next.js project với TypeScript
- [ ] Cài đặt MUI v6 + Emotion
- [ ] Tạo `lib/theme.ts` với custom theme
- [ ] Wrap app với `ThemeProvider` trong `app/layout.tsx`
- [ ] Build Header + Footer layout
- [ ] Build từng section trang chủ theo thứ tự
- [ ] Responsive kiểm tra trên mobile/tablet/desktop
- [ ] SEO: metadata, Open Graph
- [ ] Performance: Image optimization với `next/image`
