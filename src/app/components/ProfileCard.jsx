'use client';

import React, { useState } from 'react';
import { User, Mail, GraduationCap, Calendar, Star, Edit3, Save, X } from 'lucide-react';

export default function ProfileCard({ student, onUpdate }) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(student.avatar || '/default.png');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  ];

  const handleUpdateAvatar = async (selectedUrl) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/student/update-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: student.regNo, avatarUrl: selectedUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update avatar');

      setAvatarUrl(selectedUrl);
      // Sync local storage
      const stored = JSON.parse(localStorage.getItem('student') || '{}');
      stored.avatar = selectedUrl;
      localStorage.setItem('student', JSON.stringify(stored));

      if (onUpdate) onUpdate(data.student);
      setIsEditingAvatar(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden shadow-xl max-w-4xl mx-auto">
      {/* Decorative gradient blur */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-xl bg-slate-800">
            <img
              src={avatarUrl}
              alt={student.name}
              onError={(e) => { e.target.src = '/default.png'; }}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => setIsEditingAvatar(true)}
            className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-lg transition-colors duration-200"
            title="Edit Profile Image"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile details grid */}
        <div className="flex-1 w-full">
          <div className="text-center md:text-left mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
            <p className="text-indigo-400 font-medium text-sm tracking-wide">{student.regNo}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Email Address</p>
                <p className="text-sm font-medium text-slate-200 truncate">{student.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Department</p>
                <p className="text-sm font-medium text-slate-200">{student.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Academic Session</p>
                <p className="text-sm font-medium text-slate-200">{student.session}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-indigo-600/10 p-3.5 rounded-xl border border-indigo-500/20">
              <Star className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-[10px] text-indigo-300 font-semibold uppercase">Cumulative GPA</p>
                <p className="text-sm font-bold text-white">{student.gpa.toFixed(2)} / 4.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar selection modal */}
      {isEditingAvatar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a24] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditingAvatar(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-white mb-2">Change Profile Photo</h4>
            <p className="text-xs text-slate-400 mb-4">Select one of our preset templates to instantly refresh your avatar</p>

            {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

            <div className="grid grid-cols-4 gap-3 mb-6">
              {presetAvatars.map((url, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleUpdateAvatar(url)}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all duration-200 scale-95 hover:scale-100 relative group bg-slate-800"
                >
                  <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <label className="block text-xs font-semibold text-slate-400 mb-2">OR ENTER CUSTOM IMAGE URL</label>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = e.target.elements.customUrl.value.trim();
                  if (val) handleUpdateAvatar(val);
                }}
                className="flex gap-2"
              >
                <input
                  name="customUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  defaultValue={avatarUrl.startsWith('http') && !presetAvatars.includes(avatarUrl) ? avatarUrl : ''}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
