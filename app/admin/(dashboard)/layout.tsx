import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell min-h-screen bg-[#F7F6F3] font-montserrat">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminTopbar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
