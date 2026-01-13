import ProtectedRoute from '@/app/components/ProtectedRoute';
import AdminNavbar from '@/app/components/navbar/AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}