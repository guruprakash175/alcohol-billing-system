'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { FiHome, FiDollarSign, FiCheckCircle, FiLogOut } from 'react-icons/fi';

export default function CashierNavbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    { href: '/cashier/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/cashier/billing', label: 'Billing', icon: FiDollarSign },
    { href: '/cashier/verify', label: 'Verify', icon: FiCheckCircle },
  ];

  return (
    <nav className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Alcohol POS</h1>
              <p className="text-amber-200 text-xs">Cashier Portal</p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-800 text-white'
                        : 'text-amber-100 hover:bg-amber-500 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-amber-100 hover:bg-red-600 hover:text-white rounded-md transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}