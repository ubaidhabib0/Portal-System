'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  User, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Lock, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
    { href: '/dashboard/results', label: 'Results', icon: GraduationCap },
    { href: '/dashboard/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/dashboard/fees', label: 'Fees', icon: CreditCard },
    { href: '/dashboard/credentials', label: 'Credentials', icon: Lock },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('regNo');
    localStorage.removeItem('student');
    router.push('/');
  };

  return (
    <aside className="sidebar-container">
      <div>
        {/* Logo Section */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-box">UD</div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>UniPortal</h1>
            <p style={{ fontSize: '10px', color: 'var(--text-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              Student Console
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-links">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div style={{ borderTop: '1px solid var(--border-glass-light)', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-danger)' }}
        >
          <LogOut style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
