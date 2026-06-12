'use client';

import React, { useState } from 'react';
import { Calendar, CheckSquare, Plus, Minus, AlertCircle } from 'lucide-react';

export default function AttendanceTable({ student, onUpdate }) {
  const [loadingCode, setLoadingCode] = useState(null);
  const [error, setError] = useState('');

  const handleAdjustAttendance = async (item, changeAttended, changeTotal) => {
    setLoadingCode(item.subjectCode);
    setError('');
    try {
      const newAttended = Math.max(0, item.attendedLectures + changeAttended);
      const newTotal = Math.max(newAttended, item.totalLectures + changeTotal);

      const res = await fetch('/api/student/update-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: student.regNo,
          subjectCode: item.subjectCode,
          subjectName: item.subjectName,
          totalLectures: newTotal,
          attendedLectures: newAttended
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update attendance');

      if (onUpdate) onUpdate(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Course Attendance Registry</h3>
          <p className="text-xs text-slate-400">Students require a minimum of 75% attendance to sit in exams</p>
        </div>
      </div>

      <hr className="border-white/10 my-4" />

      {error && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {student.attendance.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
          <p className="text-sm text-slate-400">No subjects currently enrolled or mapped for attendance.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Course</th>
                <th className="pb-3 text-center">Lectures</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Simulate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {student.attendance.map((item) => {
                const pct = item.totalLectures > 0 
                  ? Math.round((item.attendedLectures / item.totalLectures) * 100) 
                  : 100;
                
                const isShortage = pct < 75;
                const isLoading = loadingCode === item.subjectCode;

                return (
                  <tr key={item.subjectCode} className="hover:bg-white/5 transition-colors duration-200">
                    {/* Course Info */}
                    <td className="py-4 pl-2">
                      <div className="font-semibold text-white">{item.subjectName}</div>
                      <div className="text-[11px] text-indigo-400 font-semibold">{item.subjectCode}</div>
                    </td>

                    {/* Numeric Lectures */}
                    <td className="py-4 text-center font-semibold text-slate-200">
                      {item.attendedLectures} / {item.totalLectures}
                    </td>

                    {/* Percentage Progress Bar */}
                    <td className="py-4 w-44">
                      <div className="flex items-center gap-3">
                        <div className="progress-track">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`progress-fill ${
                              isShortage 
                                ? 'progress-shortage' 
                                : 'progress-safe'
                            }`}
                          ></div>
                        </div>
                        <span className={`text-xs font-bold ${isShortage ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 text-center">
                      <span className={`portal-badge ${
                        isShortage 
                          ? 'portal-badge-shortage' 
                          : 'portal-badge-safe'
                      }`}>
                        {isShortage ? 'Shortage' : 'Safe'}
                      </span>
                    </td>

                    {/* Simulator buttons */}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isLoading}
                          onClick={() => handleAdjustAttendance(item, 1, 1)}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 p-1.5 rounded-lg border border-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                          title="Simulate Attend Lecture"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={() => handleAdjustAttendance(item, 0, 1)}
                          className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 p-1.5 rounded-lg border border-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                          title="Simulate Miss Lecture"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
