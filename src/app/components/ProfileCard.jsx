'use client';

import React, { useState, useRef } from 'react';
import { User, Mail, GraduationCap, Calendar, Star, Edit3, Save, X, Upload, Phone, ShieldCheck } from 'lucide-react';

export default function ProfileCard({ student, onUpdate }) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(student.avatar || '/default.png');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadBase64, setUploadBase64] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setUploadBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!uploadBase64) {
      setError('Please choose or upload a file first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/student/update-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: student.regNo, avatarUrl: uploadBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update avatar');

      setAvatarUrl(uploadBase64);
      
      // Sync local storage
      const stored = JSON.parse(localStorage.getItem('student') || '{}');
      stored.avatar = uploadBase64;
      localStorage.setItem('student', JSON.stringify(stored));

      if (onUpdate) onUpdate(data.student);
      setIsEditingAvatar(false);
      setPreviewUrl('');
      setUploadBase64('');
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
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-xl bg-slate-800 relative">
            <img
              src={avatarUrl}
              alt={student.name}
              onError={(e) => { e.target.src = '/default.png'; }}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => {
              setIsEditingAvatar(true);
              setError('');
              setPreviewUrl('');
              setUploadBase64('');
            }}
            className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
            title="Upload Profile Image"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile details grid */}
        <div className="flex-1 w-full">
          <div className="text-center md:text-left mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
            <p className="text-indigo-400 font-semibold text-sm tracking-wide">{student.regNo}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            {/* University */}
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5 col-span-1 sm:col-span-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">University</p>
                <p className="text-sm font-semibold text-slate-100">{student.university || 'Apex University of Science & Technology'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Email Address</p>
                <p className="text-sm font-medium text-slate-200 truncate">{student.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Contact Number</p>
                <p className="text-sm font-medium text-slate-200">{student.phone || '+92 300 1234567'}</p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Department</p>
                <p className="text-sm font-medium text-slate-200">{student.department}</p>
              </div>
            </div>

            {/* Academic Session */}
            <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Academic Session</p>
                <p className="text-sm font-medium text-slate-200">{student.session}</p>
              </div>
            </div>

            {/* Cumulative GPA */}
            <div className="flex items-center space-x-3 bg-indigo-600/10 p-3.5 rounded-xl border border-indigo-500/20 col-span-1 sm:col-span-2">
              <Star className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-[10px] text-indigo-300 font-semibold uppercase">Cumulative GPA</p>
                <p className="text-sm font-bold text-white">{student.gpa ? student.gpa.toFixed(2) : '0.00'} / 4.00</p>
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

            <h4 className="text-lg font-bold text-white mb-2">Upload Profile Photo</h4>
            <p className="text-xs text-slate-400 mb-4">Select an image file from your device (Max 2MB)</p>

            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-xl text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateAvatar} className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors duration-200 bg-white/5"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-indigo-400" />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white">Click to upload photo</p>
                      <p className="text-[10px] text-slate-500 mt-1">PNG, JPG or JPEG formats only</p>
                    </div>
                  </>
                )}
              </div>

              {previewUrl && (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      setUploadBase64('');
                    }}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold rounded-xl text-xs transition-colors duration-200"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 active:scale-98 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {loading ? 'Uploading...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
