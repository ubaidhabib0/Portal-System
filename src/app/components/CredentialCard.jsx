'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Check, AlertCircle, KeyRound, ShieldQuestion } from 'lucide-react';

export default function CredentialCard({ regNo }) {
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'question'
  const [securityQuestion, setSecurityQuestion] = useState('Loading security question...');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (regNo) {
      fetch(`/api/credentials?regNo=${encodeURIComponent(regNo)}`)
        .then(res => res.json())
        .then(data => {
          if (data.securityQuestion) {
            setSecurityQuestion(data.securityQuestion);
          } else {
            setSecurityQuestion('What is your favorite pet? (Default)');
          }
        })
        .catch(err => {
          console.error('Error fetching security question:', err);
          setSecurityQuestion('What is your favorite pet? (Default)');
        });
    }
  }, [regNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        regNo,
        newPassword,
      };

      if (authMode === 'password') {
        payload.currentPassword = currentPassword;
      } else {
        payload.securityAnswer = securityAnswer;
      }

      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setSecurityAnswer('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl w-full max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
        <Lock className="w-5 h-5 text-indigo-400" />
        Security Credentials
      </h3>
      <p className="text-xs text-slate-400 mb-6">Manage password and account recovery settings</p>

      {error && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6 bg-white/5 p-1 rounded-xl border border-white/5">
        <button
          type="button"
          onClick={() => { setAuthMode('password'); setError(''); setSuccess(''); }}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            authMode === 'password'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Current Password
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('question'); setError(''); setSuccess(''); }}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            authMode === 'question'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldQuestion className="w-3.5 h-3.5" />
          Security Question
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {authMode === 'password' ? (
          <div>
            <label className="block font-semibold text-slate-400 mb-1.5">CURRENT PASSWORD</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full"
              required={authMode === 'password'}
            />
          </div>
        ) : (
          <div>
            <label className="block font-semibold text-indigo-400 mb-1">SECURITY CHALLENGE</label>
            <p className="text-slate-300 font-medium mb-2">{securityQuestion}</p>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter recovery answer"
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full"
              required={authMode === 'question'}
            />
          </div>
        )}

        <hr className="border-white/5" />

        <div>
          <label className="block font-semibold text-slate-400 mb-1.5">NEW PASSWORD</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-400 mb-1.5">CONFIRM NEW PASSWORD</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 active:scale-98 shadow-lg shadow-indigo-600/20"
        >
          {loading ? 'Processing...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
