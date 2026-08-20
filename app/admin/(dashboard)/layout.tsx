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
      <div className="flex min-h-screen min-w-0">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
