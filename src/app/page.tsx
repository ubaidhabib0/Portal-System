'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Mail, GraduationCap, Calendar, ShieldQuestion, HelpCircle, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login Form States
  const [loginRegNo, setLoginRegNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupRegNo, setSignupRegNo] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDept, setSignupDept] = useState('');
  const [signupSession, setSignupSession] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('What is your favorite pet?');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Operations status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Automatically redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const regNo = localStorage.getItem('regNo');
    if (token && regNo) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: loginRegNo, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('regNo', data.student.regNo);
      localStorage.setItem('student', JSON.stringify(data.student));

      setSuccess('Access granted! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          regNo: signupRegNo,
          email: signupEmail,
          department: signupDept,
          session: signupSession,
          password: signupPassword,
          securityQuestion,
          securityAnswer
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setSuccess('Registration successful! Please log in.');
      setActiveTab('login');
      // Reset signup fields
      setSignupName('');
      setSignupRegNo('');
      setSignupEmail('');
      setSignupDept('');
      setSignupSession('');
      setSignupPassword('');
      setSecurityAnswer('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seeding failed');

      setSuccess('Database successfully populated with rich sample data! Default student: CS-2021-001 (Pass: password123)');
      // Pre-fill login details for user convenience
      setLoginRegNo('CS-2021-001');
      setLoginPassword('password123');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Dynamic background blurs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(99, 102, 241, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        top: '15%',
        left: '20%',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        background: 'rgba(168, 85, 247, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        bottom: '15%',
        right: '20%',
        pointerEvents: 'none'
      }}></div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '450px' }}>
        {/* Branding header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.25)'
          }}>
            UP
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>UniPortal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>University Dropdown Management System</p>
        </div>

        {/* Form Container Card */}
        <div className="portal-card" style={{ marginBottom: '1.5rem' }}>
          {/* Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              style={{
                background: activeTab === 'login' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'login' ? 'white' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '0.625rem',
                padding: '0.5rem 0',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Log In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              style={{
                background: activeTab === 'signup' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'signup' ? 'white' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '0.625rem',
                padding: '0.5rem 0',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#fda4af',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#a7f3d0',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              marginBottom: '1rem'
            }}>
              <Check style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>REGISTRATION NUMBER</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={loginRegNo}
                    onChange={(e) => setLoginRegNo(e.target.value)}
                    placeholder="CS-2021-001"
                    className="portal-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                  <User style={{ position: 'absolute', left: '0.875rem', top: '0.75rem', width: '1rem', height: '1rem', color: 'var(--text-dark)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="portal-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                  <Lock style={{ position: 'absolute', left: '0.875rem', top: '0.75rem', width: '1rem', height: '1rem', color: 'var(--text-dark)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="portal-btn"
                style={{ width: '100%', marginTop: '0.5rem', height: '42px' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>FULL NAME</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="John Doe"
                    className="portal-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>REGISTRATION NO</label>
                  <input
                    type="text"
                    value={signupRegNo}
                    onChange={(e) => setSignupRegNo(e.target.value)}
                    placeholder="CS-2021-002"
                    className="portal-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="john@uni.edu"
                  className="portal-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>DEPARTMENT</label>
                  <input
                    type="text"
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                    placeholder="Computer Science"
                    className="portal-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>SESSION</label>
                  <input
                    type="text"
                    value={signupSession}
                    onChange={(e) => setSignupSession(e.target.value)}
                    placeholder="2021-2025"
                    className="portal-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>SECURITY QUESTION</label>
                <select
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="portal-input"
                  style={{ appearance: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                >
                  <option value="What is your favorite pet?">What is your favorite pet?</option>
                  <option value="What was the name of your primary school?">What was the name of your primary school?</option>
                  <option value="In what city were you born?">In what city were you born?</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>SECURITY ANSWER</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="portal-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>PASSWORD</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="portal-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="portal-btn"
                style={{ width: '100%', marginTop: '0.5rem', height: '42px' }}
              >
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>

        {/* Database Seeder Button (Highly convenient) */}
        <button
          onClick={handleSeedDatabase}
          disabled={loading}
          style={{
            width: '100%',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px border-solid rgba(99, 102, 241, 0.2)',
            borderRadius: '1.25rem',
            padding: '1rem',
            color: '#818cf8',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Sparkles style={{ width: '1rem', height: '1rem' }} />
          <span>SEED DEMO DATASET (GET STARTED QUICKLY)</span>
        </button>
      </div>
    </div>
  );
}
