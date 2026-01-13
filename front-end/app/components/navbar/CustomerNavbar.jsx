'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useCart } from '@/app/hooks/useCart';
import { FiShoppingBag, FiShoppingCart, FiClock, FiUser, FiLogOut } from 'react-icons/fi';

export default function CustomerNavbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { getItemCount } = useCart();

  const navLinks = [
    { href: '/customer/order', label: 'Order', icon: FiShoppingBag },
    { href: '/customer/cart', label: 'Cart', icon: FiShoppingCart, badge: getItemCount() },
    { href: '/customer/history', label: 'History', icon: FiClock },
    { href: '/customer/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Alcohol POS</h1>
              <p className="text-blue-200 text-xs">Customer Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {link.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
              
              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:bg-red-600 hover:text-white rounded-md transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-blue-100 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}