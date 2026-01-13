import ProtectedRoute from '@/app/components/ProtectedRoute';
import CustomerNavbar from '@/app/components/navbar/CustomerNavbar';
import { CartProvider } from '@/app/context/CartContext';

export default function CustomerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <CustomerNavbar />
          <main>{children}</main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  );
}