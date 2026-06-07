'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Award, CheckSquare, Wallet, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const regNo = localStorage.getItem('regNo');
      if (!regNo) throw new Error('Registration number not found in session.');

      // Fetch Student Profile
      const studentRes = await fetch(`/api/student/${encodeURIComponent(regNo)}`);
      const studentData = await studentRes.json();
      if (!studentRes.ok) throw new Error(studentData.error || 'Failed to fetch student profile.');
      
      setStudent(studentData.student);
      localStorage.setItem('student', JSON.stringify(studentData.student));

      // Fetch Fees
      const feesRes = await fetch(`/api/fee?regNo=${encodeURIComponent(regNo)}`);
      const feesData = await feesRes.json();
      if (feesRes.ok) {
        setFees(feesData.fees);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-muted)' }}>
        Loading student console data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="portal-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>Failed to Load Dashboard</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={fetchDashboardData} className="portal-btn" style={{ marginTop: '1rem' }}>Retry Loading</button>
      </div>
    );
  }

  // Calculate stats
  const enrolledCoursesCount = student?.subjects?.length || 0;
  
  // Attendance Average
  const attendanceAvg = student?.attendance?.length > 0
    ? Math.round(
        (student.attendance.reduce((sum, item) => {
          const pct = item.totalLectures > 0 ? (item.attendedLectures / item.totalLectures) : 1;
          return sum + pct;
        }, 0) / student.attendance.length) * 100
      )
    : 100;

  // Unpaid Fees Amount
  const unpaidFeesSum = fees
    .filter(f => f.status === 'Unpaid')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Widget */}
      <div className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Welcome back, {student?.name}! <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'yellow' }} />
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Here is your academic overview for the current session.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="portal-badge portal-badge-safe" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
            {student?.session}
          </span>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* GPA widget */}
        <Link href="/dashboard/results" style={{ textDecoration: 'none' }}>
          <div className="portal-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px', cursor: 'pointer' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
              <Award style={{ width: '1.75rem', height: '1.75rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, uppercase: 'true' }}>CUMULATIVE GPA</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.125rem' }}>{student?.gpa?.toFixed(2)}</p>
            </div>
          </div>
        </Link>

        {/* Attendance widget */}
        <Link href="/dashboard/attendance" style={{ textDecoration: 'none' }}>
          <div className="portal-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px', cursor: 'pointer' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
              <CheckSquare style={{ width: '1.75rem', height: '1.75rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, uppercase: 'true' }}>ATTENDANCE AVG</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.125rem' }}>{attendanceAvg}%</p>
            </div>
          </div>
        </Link>

        {/* Course enrollment widget */}
        <Link href="/dashboard/subjects" style={{ textDecoration: 'none' }}>
          <div className="portal-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px', cursor: 'pointer' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <BookOpen style={{ width: '1.75rem', height: '1.75rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, uppercase: 'true' }}>ENROLLED COURSES</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.125rem' }}>{enrolledCoursesCount}</p>
            </div>
          </div>
        </Link>

        {/* Fees widget */}
        <Link href="/dashboard/fees" style={{ textDecoration: 'none' }}>
          <div className="portal-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px', cursor: 'pointer' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
              <Wallet style={{ width: '1.75rem', height: '1.75rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, uppercase: 'true' }}>UNPAID CHALLANS</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.125rem' }}>Rs. {unpaidFeesSum.toLocaleString()}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main dashboard body - Academic profile overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Info panel */}
        <div className="portal-card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-light)', paddingBottom: '0.75rem' }}>
            Personal Details Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>NAME</p>
              <p style={{ color: 'white', fontWeight: 500, marginTop: '0.25rem' }}>{student?.name}</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>REGISTRATION NUMBER</p>
              <p style={{ color: 'white', fontWeight: 500, marginTop: '0.25rem' }}>{student?.regNo}</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>EMAIL ADDRESS</p>
              <p style={{ color: 'white', fontWeight: 500, marginTop: '0.25rem' }}>{student?.email}</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>DEPARTMENT</p>
              <p style={{ color: 'white', fontWeight: 500, marginTop: '0.25rem' }}>{student?.department}</p>
            </div>
          </div>
          <Link href="/dashboard/profile" className="portal-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start', marginTop: '1.5rem', fontSize: '0.75rem' }}>
            <span>Manage Profile Detail</span>
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </Link>
        </div>

        {/* Quick Help widget */}
        <div className="portal-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Need Support?
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Have questions about registration schedules, credit caps, grade updates, or paid tuition statuses? Connect with the student helpdesk.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>Registrar Office Support</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>support@uniportal.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
