'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Check,
  AlertCircle,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login
  const [loginRegNo, setLoginRegNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup
  const [signupName, setSignupName] = useState('');
  const [signupRegNo, setSignupRegNo] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupUni, setSignupUni] = useState(
    'Apex University of Science & Technology'
  );
  const [signupDept, setSignupDept] = useState('');
  const [signupSession, setSignupSession] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(
    'What is your favorite pet?'
  );
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto Redirect
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    resetMessages();

    if (!loginRegNo.trim() || !loginPassword.trim()) {
      setError('Please enter registration number and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regNo: loginRegNo.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('regNo', data.student.regNo);
      localStorage.setItem('name', data.student.name);

      setSuccess('Access granted! Redirecting...');

      setTimeout(() => {
        router.replace('/dashboard');
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    resetMessages();

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupName.trim(),
          regNo: signupRegNo.trim(),
          email: signupEmail.trim().toLowerCase(),
          phone: signupPhone.trim(),
          university: signupUni.trim(),
          department: signupDept.trim(),
          session: signupSession.trim(),
          password: signupPassword,
          securityQuestion,
          securityAnswer: securityAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess('Registration successful! Please login.');

      setSignupName('');
      setSignupRegNo('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupDept('');
      setSignupSession('');
      setSignupPassword('');
      setSecurityAnswer('');

      setActiveTab('login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (loading) return;

    resetMessages();
    setLoading(true);

    try {
      const res = await fetch('/api/seed');

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Seeding failed');
      }

      setSuccess(
        'Database seeded successfully! Demo Login: CS-2021-001 / password123'
      );

      setLoginRegNo('CS-2021-001');
      setLoginPassword('password123');
      setActiveTab('login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth:
            activeTab === 'signup'
              ? '700px'
              : '450px',
        }}
      >
        <div
          className="portal-card"
          style={{
            padding: '2rem',
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            UniPortal
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              className="portal-btn"
              onClick={() => {
                setActiveTab('login');
                resetMessages();
              }}
            >
              Login
            </button>

            <button
              type="button"
              className="portal-btn"
              onClick={() => {
                setActiveTab('signup');
                resetMessages();
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div
              style={{
                color: '#ef4444',
                marginBottom: '1rem',
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: '#10b981',
                marginBottom: '1rem',
              }}
            >
              <Check size={16} />
              {success}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <input
                className="portal-input"
                placeholder="Registration Number"
                value={loginRegNo}
                onChange={(e) =>
                  setLoginRegNo(e.target.value)
                }
                required
              />

              <input
                type="password"
                className="portal-input"
                placeholder="Password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="portal-btn"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading
                  ? 'Authenticating...'
                  : 'Sign In'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignup}
              style={{
                display: 'grid',
                gap: '1rem',
              }}
            >
              <input
                className="portal-input"
                placeholder="Full Name"
                value={signupName}
                onChange={(e) =>
                  setSignupName(e.target.value)
                }
                required
              />

              <input
                className="portal-input"
                placeholder="Registration Number"
                value={signupRegNo}
                onChange={(e) =>
                  setSignupRegNo(e.target.value)
                }
                required
              />

              <input
                type="email"
                className="portal-input"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) =>
                  setSignupEmail(e.target.value)
                }
                required
              />

              <input
                type="tel"
                className="portal-input"
                placeholder="Phone"
                value={signupPhone}
                onChange={(e) =>
                  setSignupPhone(e.target.value)
                }
                required
              />

              <input
                className="portal-input"
                placeholder="University"
                value={signupUni}
                onChange={(e) =>
                  setSignupUni(e.target.value)
                }
                required
              />

              <input
                className="portal-input"
                placeholder="Department"
                value={signupDept}
                onChange={(e) =>
                  setSignupDept(e.target.value)
                }
                required
              />

              <input
                className="portal-input"
                placeholder="Session"
                value={signupSession}
                onChange={(e) =>
                  setSignupSession(e.target.value)
                }
                required
              />

              <select
                className="portal-input"
                value={securityQuestion}
                onChange={(e) =>
                  setSecurityQuestion(e.target.value)
                }
              >
                <option>
                  What is your favorite pet?
                </option>
                <option>
                  What was the name of your primary school?
                </option>
                <option>
                  In what city were you born?
                </option>
              </select>

              <input
                className="portal-input"
                placeholder="Security Answer"
                value={securityAnswer}
                onChange={(e) =>
                  setSecurityAnswer(e.target.value)
                }
                required
              />

              <input
                type="password"
                className="portal-input"
                placeholder="Password"
                autoComplete="new-password"
                value={signupPassword}
                onChange={(e) =>
                  setSignupPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="portal-btn"
              >
                {loading
                  ? 'Creating Account...'
                  : 'Register'}
              </button>
            </form>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleSeedDatabase}
            disabled={loading}
            className="portal-btn"
            style={{
              width: '100%',
              marginTop: '1rem',
            }}
          >
            <Sparkles size={16} />
            Seed Demo Data
          </button>
        )}
      </div>
    </div>
  );
}