'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Console Dashboard';
      case '/dashboard/profile':
        return 'Student Profile';
      case '/dashboard/attendance':
        return 'Attendance Tracker';
      case '/dashboard/results':
        return 'Academic Transcripts';
      case '/dashboard/subjects':
        return 'Course Registrations';
      case '/dashboard/fees':
        return 'Tuition & Fees';
      case '/dashboard/credentials':
        return 'Security Settings';
      default:
        return 'Console Dashboard';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const regNo = localStorage.getItem('regNo');

    if (!token || !regNo) {
      localStorage.removeItem('token');
      localStorage.removeItem('regNo');
      localStorage.removeItem('student');
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0e17',
        color: '#94a3b8',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="portal-container">
      <Sidebar />
      <div className="portal-content">
        <Navbar title={getPageTitle()} />
        <main className="portal-main-area">
          {children}
        </main>
      </div>
    </div>
  );
}
