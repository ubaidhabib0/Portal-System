'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../components/AttendanceTable';

export default function AttendancePage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('student');

    if (saved) {
      try {
        setStudent(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing student data in AttendancePage:', e);
      }
    }

    setLoading(false);
  }, []);

  const handleUpdate = (updatedStudent) => {
    setStudent(updatedStudent);
    localStorage.setItem('student', JSON.stringify(updatedStudent));
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading records...</div>;
  }

  if (!student) {
    return (
      <div 
        className="portal-card" 
        style={{ 
          maxWidth: '500px', 
          margin: '2rem auto', 
          textAlign: 'center' 
        }}
      >
        <p style={{ color: 'var(--text-muted)' }}>
          Session expired. Please log out and sign in again.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AttendanceTable 
        student={student} 
        onUpdate={handleUpdate} 
      />
    </div>
  );
}