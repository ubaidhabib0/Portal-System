'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import Dropdown from './Dropdown';

export default function SubjectTable({ student, catalog, onUpdate }) {
  // States for adding a new subject
  const [selectedCatalogCode, setSelectedCatalogCode] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Find currently selected subject details in the catalog
  const selectedCatalogItem = catalog.find(item => item.code === selectedCatalogCode);

  // Filter catalog items to show only those the student is NOT currently enrolled in
  const availableCatalog = catalog.filter(
    item => !student.subjects.some(sub => sub.code === item.code)
  );

  const subjectOptions = availableCatalog.map(item => ({
    value: item.code,
    label: `${item.code} - ${item.name} (${item.credits} Cr)`
  }));

  const handleCatalogChange = (code) => {
    setSelectedCatalogCode(code);
    const item = catalog.find(i => i.code === code);
    if (item) {
      setSelectedInstructor(item.instructors[0] || '');
      setSelectedSection(item.sections[0] || '');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedCatalogCode || !selectedInstructor || !selectedSection) {
      setError('Please select a course, instructor, and section.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/student/add-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: student.regNo,
          subjectCode: selectedCatalogCode,
          instructor: selectedInstructor,
          section: selectedSection
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enroll');

      setSuccess(`Enrolled in ${selectedCatalogCode} successfully!`);
      setSelectedCatalogCode('');
      setSelectedInstructor('');
      setSelectedSection('');

      if (onUpdate) onUpdate(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (subjectCode) => {
    if (!confirm(`Are you sure you want to drop ${subjectCode}?`)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/student/drop-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: student.regNo,
          subjectCode
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to drop subject');

      setSuccess(`Dropped ${subjectCode} successfully.`);
      if (onUpdate) onUpdate(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEnrolledDetails = async (subjectCode, instructor, section) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/student/change-instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: student.regNo,
          subjectCode,
          instructor,
          section
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change configuration');

      setSuccess(`Updated details for ${subjectCode}.`);
      if (onUpdate) onUpdate(data.student);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Enroll Form Widget */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Enroll New Subject
        </h3>

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

        <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">SELECT SUBJECT</label>
            <Dropdown
              options={subjectOptions}
              selected={selectedCatalogCode}
              onChange={handleCatalogChange}
              placeholder="Choose a Course"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">INSTRUCTOR</label>
            <Dropdown
              options={selectedCatalogItem ? selectedCatalogItem.instructors : []}
              selected={selectedInstructor}
              onChange={setSelectedInstructor}
              placeholder="Choose Instructor"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">SECTION</label>
            <Dropdown
              options={selectedCatalogItem ? selectedCatalogItem.sections : []}
              selected={selectedSection}
              onChange={setSelectedSection}
              placeholder="Choose Section"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedCatalogCode}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 active:scale-98 shadow-lg shadow-indigo-600/20 h-[42px]"
          >
            <Plus className="w-4 h-4" />
            Enroll Subject
          </button>
        </form>
      </div>

      {/* Enrolled Courses Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Currently Enrolled Subjects</h3>

        {student.subjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-sm text-slate-400">You are not registered in any subjects for this session.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Subject Info</th>
                  <th className="pb-3 text-center">Credits</th>
                  <th className="pb-3">Section / Classroom</th>
                  <th className="pb-3">Assigned Faculty</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {student.subjects.map((sub) => {
                  // Find full catalog info for lists of options
                  const catalogItem = catalog.find(item => item.code === sub.code);
                  const instructors = catalogItem ? catalogItem.instructors : [sub.instructor];
                  const sections = catalogItem ? catalogItem.sections : [sub.section];

                  return (
                    <tr key={sub.code} className="hover:bg-white/5 transition-colors duration-200">
                      {/* Course */}
                      <td className="py-4 pl-2">
                        <div className="font-semibold text-white">{sub.name}</div>
                        <div className="text-[11px] text-indigo-400 font-semibold">{sub.code}</div>
                      </td>

                      {/* Credits */}
                      <td className="py-4 text-center font-semibold text-slate-200">
                        {sub.credits}
                      </td>

                      {/* Section Dropdown */}
                      <td className="py-4 w-40 pr-4">
                        <Dropdown
                          options={sections}
                          selected={sub.section}
                          onChange={(val) => handleChangeEnrolledDetails(sub.code, sub.instructor, val)}
                        />
                      </td>

                      {/* Instructor Dropdown */}
                      <td className="py-4 w-52 pr-4">
                        <Dropdown
                          options={instructors}
                          selected={sub.instructor}
                          onChange={(val) => handleChangeEnrolledDetails(sub.code, val, sub.section)}
                        />
                      </td>

                      {/* Drop Action */}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDrop(sub.code)}
                          disabled={loading}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2.5 rounded-xl border border-rose-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
                          title="Drop Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
