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
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Security Credentials</h3>
          <p className="text-xs text-slate-400">Manage password and account recovery settings</p>
        </div>
      </div>

      <hr className="border-white/10 my-4" />

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
          className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            authMode === 'password'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Current Password
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('question'); setError(''); setSuccess(''); }}
          className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            authMode === 'question'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldQuestion className="w-3.5 h-3.5" />
          Security Question
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === 'password' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="portal-input"
              required={authMode === 'password'}
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-indigo-400 mb-1 uppercase tracking-wide">Security Challenge</label>
            <p className="text-xs text-slate-300 font-medium mb-3 bg-white/5 p-3 rounded-lg border border-white/5">{securityQuestion}</p>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter recovery answer"
              className="portal-input"
              required={authMode === 'question'}
            />
          </div>
        )}

        <hr className="border-white/5 my-4" />

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="portal-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="portal-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="portal-btn w-full mt-2 h-[42px]"
        >
          {loading ? 'Processing...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
