import ProtectedRoute from '@/app/components/ProtectedRoute';
import CashierNavbar from '@/app/components/navbar/CashierNavbar';

export default function CashierLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['cashier', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <CashierNavbar />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}