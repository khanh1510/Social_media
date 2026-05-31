import { redirect } from 'next/navigation'

const validPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook']

export function generateStaticParams() {
  return validPlatforms.map((p) => ({ platform: p }))
}

export default async function ServicePage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  if (!validPlatforms.includes(platform)) redirect('/auth/login')
  redirect('/auth/login')
}
