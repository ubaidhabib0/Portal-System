'use client';

import React, { useState } from 'react';
import { Award, CheckSquare, Plus, Minus, AlertCircle } from 'lucide-react';

export default function AttendanceTable({ student, onUpdate }) {
  const [loadingCode, setLoadingCode] = useState(null);
  const [error, setError] = useState('');

  const handleAdjustAttendance = async (item, changeAttended, changeTotal) => {
    setLoadingCode(item.subjectCode);
    setError('');
    try {
      const newAttended = Math.max(0, item.attendedLectures + changeAttended);
      // Ensure total is at least as much as attended
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Course Attendance Registry
          </h3>
          <p className="text-xs text-slate-400 mt-1">Students require a minimum of 75% attendance to sit in exams</p>
        </div>
      </div>

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
                <th className="pb-3 text-center">Ratio</th>
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
                      <div className="text-[11px] text-slate-500 font-semibold">{item.subjectCode}</div>
                    </td>

                    {/* Numeric Lectures */}
                    <td className="py-4 text-center font-medium">
                      {item.attendedLectures} / {item.totalLectures}
                    </td>

                    {/* Percentage Progress Bar */}
                    <td className="py-4 w-44">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isShortage 
                                ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                                : 'bg-gradient-to-r from-emerald-400 to-teal-500'
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isShortage 
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
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
