'use client';

import React, { useState, useEffect } from 'react';
import FeeCard from '../../components/FeeCard';

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFees = async () => {
    setLoading(true);
    try {
      const regNo = localStorage.getItem('regNo');
      if (!regNo) throw new Error('Registration number not found in session.');

      const res = await fetch(`/api/fee?regNo=${encodeURIComponent(regNo)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load fees information.');

      setFees(data.fees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading fee ledger...</div>;
  }

  if (error) {
    return (
      <div className="portal-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>Failed to Load Billing</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={fetchFees} className="portal-btn" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FeeCard fees={fees} onUpdate={fetchFees} />
    </div>
  );
}
