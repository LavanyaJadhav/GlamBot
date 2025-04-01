import { SideNav } from "@/components/side-nav"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
} 