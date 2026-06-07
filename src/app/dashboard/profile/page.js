'use client';

import React, { useState, useEffect } from 'react';
import ProfileCard from '../../components/ProfileCard';

export default function ProfilePage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('student');
    if (saved) {
      try {
        setStudent(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing student data in ProfilePage:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleUpdate = (updatedStudent) => {
    setStudent(updatedStudent);
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading student profile...</div>;
  }

  if (!student) {
    return (
      <div className="portal-card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No student profile data located. Please log out and sign in again.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ProfileCard student={student} onUpdate={handleUpdate} />
    </div>
  );
}
