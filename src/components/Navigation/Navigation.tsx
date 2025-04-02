'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/lib/contexts/navigation-context';
import './Navigation.css';

export function Navigation() {
  const pathname = usePathname();
  const { isBottomNavHidden } = useNavigation();

  const getIconColor = (path: string) => {
    const colors = {
      '/': '#F59E0B',      // Home - using Breakfast color
      '/search': '#16A34A', // Search - using Healthy color
      '/saved': '#DB2777',  // Saved - using Desserts color
      '/history': '#EF4444', // History - using a red color
      '/account': '#4F46E5' // Account - using Dinner color
    };

    const isActive = pathname === path;
    return isActive ? colors[path as keyof typeof colors] : '#9CA3AF'; // gray-400 for inactive
  };

  if (isBottomNavHidden) return null;

  const navLinks = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/search', icon: 'search', label: 'Search' },
    { href: '/saved', icon: 'bookmark', label: 'Saved' },
    { href: '/history', icon: 'clock-rotate-left', label: 'History' },
    { href: '/account', icon: 'user', label: 'Account' },
  ];

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 bg-white border-t h-16 px-4 sm:px-6 z-50 bottom-nav" key={pathname}>
        <div className="h-full max-w-lg mx-auto flex items-center justify-around">
          {navLinks.map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link 
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 nav-item ${isActive ? 'active' : ''}`}
                prefetch={true}
              >
                <div className="h-8 w-8 flex items-center justify-center">
                  <i className={`fa fa-${icon} text-xl`} style={{ color: getIconColor(href) }} />
                </div>
                <span className="nav-label" style={{ color: getIconColor(href) }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation for Desktop */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r p-6 flex-col gap-8 z-50 side-nav" key={`side-${pathname}`}>
        <div className="flex items-center gap-3 px-2 mb-6">
          <span className="font-bold text-xl">Recipe Website</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {navLinks.map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link 
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 nav-item ${
                  isActive ? 'bg-gray-50 active' : ''
                }`}
                prefetch={true}
              >
                <div className="h-9 w-9 flex items-center justify-center">
                  <i className={`fa fa-${icon} text-xl`} style={{ color: getIconColor(href) }} />
                </div>
                <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 