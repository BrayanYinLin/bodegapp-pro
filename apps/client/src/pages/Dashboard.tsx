import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

export function Dashboard() {
  return (
    <SidebarProvider style={{ ['--sidebar-width' as string]: '250px' }}>
      <AppSidebar />
      <main>
        <SidebarTrigger className="md:hidden" />
      </main>
    </SidebarProvider>
  )
}
