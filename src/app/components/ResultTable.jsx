'use client';

import React, { useState } from 'react';
import { Award, Plus, Minus, AlertCircle } from 'lucide-react';

export default function ResultTable({ student, onUpdate }) {
  const [loadingCode, setLoadingCode] = useState(null);
  const [error, setError] = useState('');

  const handleAdjustMarks = async (item, marksDiff) => {
    setLoadingCode(item.subjectCode);
    setError('');
    try {
      const newMarks = Math.max(0, Math.min(item.totalMarks, item.marksObtained + marksDiff));

      const res = await fetch('/api/student/update-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: student.regNo,
          subjectCode: item.subjectCode,
          subjectName: item.subjectName,
          marksObtained: newMarks,
          totalMarks: item.totalMarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update result');

      if (onUpdate) onUpdate(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCode(null);
    }
  };

  // Calculate SGPA (simple average of GPAs for this semester)
  const averageGpa = student.results.length > 0 
    ? (student.results.reduce((sum, item) => sum + item.gpa, 0) / student.results.length).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl w-full max-w-4xl mx-auto">
      {/* Header Summary widgets */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Academic Transcripts
          </h3>
          <p className="text-xs text-slate-400 mt-1">GPA updates instantly when course grades change</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Subjects</p>
            <p className="text-sm font-bold text-white">{student.results.length}</p>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] text-indigo-300 font-semibold uppercase">Semester GPA</p>
            <p className="text-sm font-bold text-white">{averageGpa}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {student.results.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
          <p className="text-sm text-slate-400">No grades or results registered yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Subject</th>
                <th className="pb-3 text-center">Marks</th>
                <th className="pb-3 text-center">Grade</th>
                <th className="pb-3 text-center">GPA Point</th>
                <th className="pb-3 text-right">Adjust Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {student.results.map((item) => {
                const isLoading = loadingCode === item.subjectCode;
                const scorePercentage = (item.marksObtained / item.totalMarks) * 100;

                return (
                  <tr key={item.subjectCode} className="hover:bg-white/5 transition-colors duration-200">
                    {/* Course */}
                    <td className="py-4 pl-2">
                      <div className="font-semibold text-white">{item.subjectName}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{item.subjectCode}</div>
                    </td>

                    {/* Marks */}
                    <td className="py-4 text-center font-medium">
                      {item.marksObtained} / {item.totalMarks}
                      <span className="text-[10px] text-slate-500 block">({Math.round(scorePercentage)}%)</span>
                    </td>

                    {/* Grade Badge */}
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold uppercase ${
                        item.grade.startsWith('A') 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.grade.startsWith('B')
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : item.grade.startsWith('C')
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.grade}
                      </span>
                    </td>

                    {/* GPA Point */}
                    <td className="py-4 text-center font-bold text-slate-200">
                      {item.gpa.toFixed(2)}
                    </td>

                    {/* Action Panel */}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isLoading || item.marksObtained >= item.totalMarks}
                          onClick={() => handleAdjustMarks(item, 5)}
                          className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 p-1.5 rounded-lg border border-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                          title="Simulate +5 Marks"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isLoading || item.marksObtained <= 0}
                          onClick={() => handleAdjustMarks(item, -5)}
                          className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 p-1.5 rounded-lg border border-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                          title="Simulate -5 Marks"
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
