'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { FiHome, FiUsers, FiPackage, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

export default function AdminNavbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
    { href: '/admin/products', label: 'Products', icon: FiPackage },
    { href: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { href: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Alcohol POS</h1>
              <p className="text-purple-200 text-xs">Admin Portal</p>
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
                        ? 'bg-purple-800 text-white'
                        : 'text-purple-100 hover:bg-purple-500 hover:text-white'
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
                className="flex items-center gap-2 px-3 py-2 text-purple-100 hover:bg-red-600 hover:text-white rounded-md transition-colors"
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