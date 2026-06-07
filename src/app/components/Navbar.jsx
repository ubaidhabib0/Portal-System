'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

export default function Navbar({ title }) {
  const [studentName, setStudentName] = useState('Student');
  const [avatar, setAvatar] = useState('/default.png');
  const [theme, setTheme] = useState('dark');

  // Load configuration on mount
  useEffect(() => {
    // 1. Load student details
    const savedStudent = localStorage.getItem('student');
    if (savedStudent) {
      try {
        const studentObj = JSON.parse(savedStudent);
        setStudentName(studentObj.name);
        setAvatar(studentObj.avatar || '/default.png');
      } catch (e) {
        console.error('Error loading student name in Navbar:', e);
      }
    }

    // 2. Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="navbar-container">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search portal..."
            className="portal-input"
            style={{ width: '180px', paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '9999px' }}
          />
          <Search style={{ width: '0.875rem', height: '0.875rem', color: 'var(--text-dark)', position: 'absolute', left: '1rem', top: '0.75rem' }} />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun style={{ width: '1.25rem', height: '1.25rem' }} />
          ) : (
            <Moon style={{ width: '1.25rem', height: '1.25rem' }} />
          )}
        </button>

        {/* Notifications */}
        <button 
          className="theme-toggle-btn" 
          style={{ position: 'relative' }}
        >
          <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{
            position: 'absolute',
            top: '0.375rem',
            right: '0.375rem',
            width: '6px',
            height: '6px',
            background: 'var(--color-primary)',
            borderRadius: '50%'
          }}></span>
        </button>

        {/* User Info */}
        <div className="navbar-user-section">
          <div style={{ textAlign: 'right', display: 'none' }} className="sm:block">
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{studentName}</p>
            <p style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Enrolled
            </p>
          </div>
          <div className="navbar-avatar">
            <img
              src={avatar}
              alt="Avatar"
              onError={(e) => { e.target.src = '/default.png'; }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
