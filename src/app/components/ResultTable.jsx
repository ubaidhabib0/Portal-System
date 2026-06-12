'use client';

import React, { useState } from 'react';
import { Award, Plus, Minus, AlertCircle, Printer, Download, Eye, X } from 'lucide-react';

export default function ResultTable({ student, onUpdate }) {
  const [loadingCode, setLoadingCode] = useState(null);
  const [error, setError] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handlePrint = () => {
    window.print();
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
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="portal-btn-emerald bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            View Transcript
          </button>
          
          <button
            onClick={handlePrint}
            className="portal-btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-center">
            <p className="text-[9px] text-slate-500 font-semibold uppercase">Subjects</p>
            <p className="text-xs font-bold text-white">{student.results.length}</p>
          </div>
          
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-center">
            <p className="text-[9px] text-indigo-300 font-semibold uppercase">Semester GPA</p>
            <p className="text-xs font-bold text-white">{averageGpa}</p>
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
                      <div className="text-[11px] text-indigo-400 font-semibold">{item.subjectCode}</div>
                    </td>

                    {/* Marks */}
                    <td className="py-4 text-center font-semibold text-slate-200">
                      {item.marksObtained} / {item.totalMarks}
                      <span className="text-[10px] text-slate-500 block font-normal">({Math.round(scorePercentage)}%)</span>
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

      {/* Screen Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a24] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-white mb-4">Official Transcript Preview</h4>

            {/* Simulated Printed Transcript sheet */}
            <div className="flex-1 overflow-y-auto bg-white text-slate-900 p-8 rounded-xl border border-white/10 space-y-6 select-none font-sans text-sm">
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
                <h2 className="text-lg font-extrabold tracking-wide text-slate-900 uppercase">
                  {student.university || 'Apex University of Science & Technology'}
                </h2>
                <h3 className="text-xs font-bold text-slate-600 tracking-wider">OFFICIAL TRANSCRIPT OF SEMESTER RESULTS</h3>
              </div>

              {/* Student Meta block */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Student Name</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{student.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Number</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{student.regNo}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Number</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.phone || '+92 300 1234567'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Department</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Session</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.session}</p>
                </div>
              </div>

              {/* Results Table */}
              <table className="w-full text-left border-collapse border-y border-slate-300">
                <thead>
                  <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2">Code</th>
                    <th className="py-2">Subject Course Title</th>
                    <th className="py-2 text-center">Marks</th>
                    <th className="py-2 text-center">Grade</th>
                    <th className="py-2 text-center">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                  {student.results.map((r) => (
                    <tr key={r.subjectCode}>
                      <td className="py-2.5 font-bold text-slate-900">{r.subjectCode}</td>
                      <td className="py-2.5">{r.subjectName}</td>
                      <td className="py-2.5 text-center">{r.marksObtained} / {r.totalMarks}</td>
                      <td className="py-2.5 text-center font-bold">{r.grade}</td>
                      <td className="py-2.5 text-center font-bold">{r.gpa.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CGPA Calculation summary */}
              <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-600">SEMESTER CUMULATIVE GPA</span>
                <span className="text-lg font-black text-slate-900">{averageGpa}</span>
              </div>

              {/* Seal and signature footer */}
              <div className="flex justify-between items-end pt-8 text-[10px] text-slate-500">
                <div>
                  <p>Issue Date: {new Date().toLocaleDateString()}</p>
                  <p className="mt-1 font-semibold">Document Ref: TR-{student.regNo.replace(/-/g, '')}</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-slate-400 mx-auto"></div>
                  <p className="font-bold text-slate-700">Controller of Examinations</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold rounded-xl text-xs transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden container specifically for window.print() output */}
      <div className="hidden-print-transcript">
        <div className="print-header">
          <h1>{student.university || 'Apex University of Science & Technology'}</h1>
          <h3>OFFICIAL ACADEMIC TRANSCRIPT</h3>
        </div>

        <div className="print-meta">
          <div className="print-meta-col">
            <p><strong>Student Name:</strong> {student.name}</p>
            <p><strong>Registration No:</strong> {student.regNo}</p>
            <p><strong>Email Address:</strong> {student.email}</p>
          </div>
          <div className="print-meta-col">
            <p><strong>Contact Number:</strong> {student.phone || '+92 300 1234567'}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Session:</strong> {student.session}</p>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Course Title</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>GPA Point</th>
            </tr>
          </thead>
          <tbody>
            {student.results.map((r) => (
              <tr key={r.subjectCode}>
                <td><strong>{r.subjectCode}</strong></td>
                <td>{r.subjectName}</td>
                <td>{r.marksObtained} / {r.totalMarks}</td>
                <td><strong>{r.grade}</strong></td>
                <td><strong>{r.gpa.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-summary">
          <span>SEMESTER CUMULATIVE GPA</span>
          <strong>{averageGpa}</strong>
        </div>

        <div className="print-footer">
          <div>
            <p>Issue Date: {new Date().toLocaleDateString()}</p>
            <p>Ref No: TR-{student.regNo.replace(/-/g, '')}</p>
          </div>
          <div className="print-signature">
            <div className="sig-line"></div>
            <p>Controller of Examinations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
