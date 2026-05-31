export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

export interface PlatformInfo {
  id: Platform
  name: string
  color: string
  serviceCount: number
  startingPrice: number
}

export interface ServicePackage {
  id: string
  name: string
  platform: Platform
  price: number
  quantity: number
  unit: string
  description: string
  popular?: boolean
  deliveryTime: string
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

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  thumbnail: string
}
