'use client';

import React, { useState, useEffect } from 'react';
import CredentialCard from '../../components/CredentialCard';

export default function CredentialsPage() {
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRegNo = localStorage.getItem('regNo');
    if (savedRegNo) {
      setRegNo(savedRegNo);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading settings...</div>;
  }

  if (!regNo) {
    return (
      <div className="portal-card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Session expired. Please log out and sign in again.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CredentialCard regNo={regNo} />
    </div>
  );
}
