import type { PageProps, Metadata } from 'rari'
import ServerTime from '@/components/ServerTime'
import Welcome from '@/components/Welcome'

export default function HomePage(_params: PageProps) {
  return (
    <div className="space-y-8">
      <Welcome />
      <ServerTime />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Home | 2048',
  description: 'Welcome to your new rari application',
}
