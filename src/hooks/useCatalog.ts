"use client";

// Hook tải catalog (categories tree + services) từ backend và map sang shape UI hiện có.
// Backend: rate = VND / 1000 đơn vị; UI hiển thị giá trên 1 đơn vị.

import { useEffect, useMemo, useState } from "react";
import { servicesApi } from "@/lib/api";
import type { ApiService, CategoryNode } from "@/lib/api/types";
import type { Service, ServiceSpeed } from "@/types";

export interface CatalogChild {
  slug: string;
  label: string;
  categoryId: string;
}

export interface CatalogPlatform {
  slug: string;
  label: string;
  children: CatalogChild[];
}

/** Suy ra tốc độ hiển thị từ averageTime ("10-30 phút", "1-6 giờ", "1-3 ngày") */
function deriveSpeed(averageTime?: string | null): ServiceSpeed {
  if (!averageTime) return "medium";
  if (averageTime.includes("ngày")) return "slow";
  if (averageTime.includes("phút")) return "fast";
  return "medium";
}

function deriveDurationMin(averageTime?: string | null): number {
  if (!averageTime) return 60;
  const nums = averageTime.match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return 60;
  const mid = nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0];
  if (averageTime.includes("ngày")) return mid * 24 * 60;
  if (averageTime.includes("giờ")) return mid * 60;
  return mid;
}

export function toUiService(s: ApiService): Service {
  return {
    id: s.publicId,
    uuid: s.id,
    name: s.name,
    min: s.min,
    max: s.max,
    price: Number.parseFloat(s.rate) / 1000,
    speed: deriveSpeed(s.averageTime),
    durationMin: deriveDurationMin(s.averageTime),
    status: "active",
    refill: s.refill,
    cancel: s.cancel,
    categorySlug: s.category.slug,
  };
}

interface CatalogState {
  platforms: CatalogPlatform[];
  services: ApiService[];
  loading: boolean;
  error: string | null;
}

export function useCatalog(): CatalogState & {
  servicesByPlatform: (platformSlug: string) => ApiService[];
  servicesByCategorySlug: (categorySlug: string) => ApiService[];
} {
  const [state, setState] = useState<CatalogState>({
    platforms: [],
    services: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tree, services] = await Promise.all([
          servicesApi.categoryTree(),
          fetchAllServices(),
        ]);
        if (cancelled) return;
        const platforms: CatalogPlatform[] = tree
          .filter((node) => node.parentId === null)
          .map((node: CategoryNode) => ({
            slug: node.slug,
            label: node.name,
            children: (node.children ?? []).map((c) => ({
              slug: c.slug,
              label: c.name,
              categoryId: c.id,
            })),
          }));
        setState({ platforms, services, loading: false, error: null });
      } catch (e) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: e instanceof Error ? e.message : "Không tải được danh sách dịch vụ.",
          }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const childToPlatform = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of state.platforms) {
      for (const c of p.children) map.set(c.slug, p.slug);
      map.set(p.slug, p.slug);
    }
    return map;
  }, [state.platforms]);

  return {
    ...state,
    servicesByPlatform: (platformSlug: string) =>
      state.services.filter((s) => childToPlatform.get(s.category.slug) === platformSlug),
    servicesByCategorySlug: (categorySlug: string) =>
      state.services.filter((s) => s.category.slug === categorySlug),
  };
}

async function fetchAllServices(): Promise<ApiService[]> {
  const all: ApiService[] = [];
  let page = 1;
  // backend giới hạn limit tối đa 100/trang
  for (;;) {
    const batch = await servicesApi.list({ page, limit: 100 });
    all.push(...batch);
    if (batch.length < 100 || page >= 10) break;
    page++;
  }
  return all;
}
