'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import SubjectTable from '../../components/SubjectTable';

export default function SubjectsPage() {
  const [student, setStudent] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const regNo = localStorage.getItem('regNo');
      if (!regNo) throw new Error('Registration number not found in session.');

      // 1. Fetch student
      const studentRes = await fetch(`/api/student/${encodeURIComponent(regNo)}`);
      const studentData = await studentRes.json();
      if (!studentRes.ok) throw new Error(studentData.error || 'Failed to fetch student details.');
      
      setStudent(studentData.student);
      localStorage.setItem('student', JSON.stringify(studentData.student));

      // 2. Fetch catalog
      const catalogRes = await fetch('/api/student/add-subject');
      const catalogData = await catalogRes.json();
      if (!catalogRes.ok) throw new Error(catalogData.error || 'Failed to fetch subjects catalog.');
      
      setCatalog(catalogData.catalog || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleUpdate = (updatedStudent) => {
    setStudent(updatedStudent);
    localStorage.setItem('student', JSON.stringify(updatedStudent));
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading course catalog...</div>;
  }

  if (error) {
    return (
      <div className="portal-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>Error Loading Registrations</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={fetchPageData} className="portal-btn" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SubjectTable student={student} catalog={catalog} onUpdate={handleUpdate} />
    </div>
  );
}
