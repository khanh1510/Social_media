import { ServicePackage } from '@/types'

export const services: ServicePackage[] = [
  // Instagram
  { id: 'ig-follow-500', name: 'Follow 500', platform: 'instagram', price: 15000, quantity: 500, unit: 'follow', description: 'Tăng 500 follow thực, tốc độ tự nhiên', deliveryTime: '1–2 ngày' },
  { id: 'ig-follow-1000', name: 'Follow 1.000', platform: 'instagram', price: 25000, quantity: 1000, unit: 'follow', description: 'Tăng 1.000 follow thực, phổ biến nhất', popular: true, deliveryTime: '1–3 ngày' },
  { id: 'ig-follow-5000', name: 'Follow 5.000', platform: 'instagram', price: 100000, quantity: 5000, unit: 'follow', description: 'Gói lớn cho trang cần tăng trưởng nhanh', deliveryTime: '3–5 ngày' },
  { id: 'ig-like-1000', name: 'Like 1.000', platform: 'instagram', price: 10000, quantity: 1000, unit: 'like', description: 'Tăng like bài đăng, tăng độ tin cậy', deliveryTime: '30 phút – 1 giờ' },
  { id: 'ig-view-10k', name: 'View Reels 10K', platform: 'instagram', price: 8000, quantity: 10000, unit: 'view', description: 'Tăng view Reels, đẩy thuật toán', deliveryTime: '1–2 giờ' },
  // TikTok
  { id: 'tt-follow-1000', name: 'Follow 1.000', platform: 'tiktok', price: 20000, quantity: 1000, unit: 'follow', description: 'Tăng follow TikTok nhanh chóng', deliveryTime: '1–2 ngày' },
  { id: 'tt-follow-5000', name: 'Follow 5.000', platform: 'tiktok', price: 80000, quantity: 5000, unit: 'follow', description: 'Gói follow lớn cho creator TikTok', popular: true, deliveryTime: '2–4 ngày' },
  { id: 'tt-like-1000', name: 'Like 1.000', platform: 'tiktok', price: 8000, quantity: 1000, unit: 'like', description: 'Tăng like video TikTok', deliveryTime: '30 phút – 1 giờ' },
  { id: 'tt-view-50k', name: 'View 50.000', platform: 'tiktok', price: 15000, quantity: 50000, unit: 'view', description: 'Tăng view mạnh, đẩy For You Page', deliveryTime: '1–3 giờ' },
  // YouTube
  { id: 'yt-sub-500', name: 'Subscriber 500', platform: 'youtube', price: 60000, quantity: 500, unit: 'subscriber', description: 'Tăng 500 subscriber thực', deliveryTime: '3–5 ngày' },
  { id: 'yt-sub-1000', name: 'Subscriber 1.000', platform: 'youtube', price: 110000, quantity: 1000, unit: 'subscriber', description: 'Đạt 1.000 sub để mở kiếm tiền YouTube', popular: true, deliveryTime: '5–7 ngày' },
  { id: 'yt-view-10k', name: 'View 10.000', platform: 'youtube', price: 40000, quantity: 10000, unit: 'view', description: 'Tăng view video YouTube', deliveryTime: '2–4 ngày' },
  { id: 'yt-like-500', name: 'Like 500', platform: 'youtube', price: 20000, quantity: 500, unit: 'like', description: 'Tăng like video YouTube', deliveryTime: '1–2 ngày' },
  // Facebook
  { id: 'fb-like-1000', name: 'Like Page 1.000', platform: 'facebook', price: 18000, quantity: 1000, unit: 'like', description: 'Tăng like trang Facebook', deliveryTime: '1–2 ngày' },
  { id: 'fb-like-5000', name: 'Like Page 5.000', platform: 'facebook', price: 70000, quantity: 5000, unit: 'like', description: 'Tăng like lớn cho fanpage', popular: true, deliveryTime: '3–5 ngày' },
  { id: 'fb-follow-1000', name: 'Follow 1.000', platform: 'facebook', price: 15000, quantity: 1000, unit: 'follow', description: 'Tăng follow cá nhân Facebook', deliveryTime: '1–2 ngày' },
  { id: 'fb-share-500', name: 'Share 500', platform: 'facebook', price: 25000, quantity: 500, unit: 'share', description: 'Tăng share bài viết Facebook', deliveryTime: '2–4 giờ' },
]

export function getServicesByPlatform(platform: string) {
  return services.filter((s) => s.platform === platform)
}
