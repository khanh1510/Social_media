# syntax=docker/dockerfile:1

# =========================================================
# Frontend: socialmedia-dashboard (Next.js 16, standalone)
# Deploy target: Coolify -> web.signalgit.com
# =========================================================

# ---------- Stage 1: deps ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Cài dependencies dựa trên lockfile để cache tối ưu.
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Stage 2: builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* là biến build-time: phải có mặt lúc `next build`
# để được nhúng vào bundle client. Coolify/CI truyền qua build arg.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Stage 3: runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Chạy dưới user không phải root cho an toàn.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy output standalone: đã gồm server.js + node_modules tối thiểu.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
