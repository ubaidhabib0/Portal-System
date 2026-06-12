'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Calendar, DollarSign, Wallet, Upload, FileText, X, Eye } from 'lucide-react';

export default function FeeCard({ fees, onUpdate }) {
  const [loadingChallan, setLoadingChallan] = useState(null);
  const [uploadingChallan, setUploadingChallan] = useState(null);
  const [error, setError] = useState('');
  const [viewingTranscript, setViewingTranscript] = useState(null); // holds base64 transcript details

  const handlePayFee = async (challanNo) => {
    setLoadingChallan(challanNo);
    setError('');
    try {
      const res = await fetch('/api/fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challanNo, status: 'Paid' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingChallan(null);
    }
  };

  const handleTranscriptUpload = async (e, challanNo) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }

    setUploadingChallan(challanNo);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result;
        const res = await fetch('/api/fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challanNo,
            transcript: base64,
            transcriptName: file.name
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        if (onUpdate) onUpdate();
      } catch (err) {
        setError(err.message);
      } finally {
        setUploadingChallan(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Computations
  const totalPaid = fees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalOutstanding = fees
    .filter(f => f.status === 'Unpaid')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Financial Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Total Paid Dues</p>
            <p className="text-2xl font-bold text-white">Rs. {totalPaid.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Outstanding Dues</p>
            <p className="text-2xl font-bold text-white">Rs. {totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Challans Grid */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          Fee Challan Statements & Enrollment Verification
        </h3>

        {fees.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-sm text-slate-400">No fee records found for this registration number.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fees.map((fee) => {
              const isPaid = fee.status === 'Paid';
              const isOutstanding = fee.status === 'Unpaid';
              const dateStr = new Date(fee.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={fee.challanNo}
                  className={`border rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] min-h-[260px] ${
                    isPaid
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                        {fee.semester}
                      </span>
                      <h4 className="text-xl font-bold text-white mt-0.5">Rs. {fee.amount.toLocaleString()}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Challan Ref: {fee.challanNo}</p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  {/* Transcript Verification Block */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-4 space-y-2">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Enrollment Verification Transcript</p>
                    
                    {fee.transcript ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium truncate max-w-[170px]">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate" title={fee.transcriptName}>{fee.transcriptName || 'transcript.pdf'}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setViewingTranscript({ name: fee.transcriptName, base64: fee.transcript })}
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 p-1.5 rounded-lg border border-indigo-500/10 transition-colors duration-200"
                            title="View Uploaded File"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <label className="bg-white/5 hover:bg-white/10 text-slate-300 p-1.5 rounded-lg border border-white/10 cursor-pointer transition-colors duration-200">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleTranscriptUpload(e, fee.challanNo)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-[10px] text-rose-400 font-medium">No verification transcript uploaded.</p>
                        <label className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors duration-200 self-start sm:self-auto">
                          <Upload className="w-3 h-3" />
                          {uploadingChallan === fee.challanNo ? 'Uploading...' : 'Upload File'}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            disabled={uploadingChallan === fee.challanNo}
                            onChange={(e) => handleTranscriptUpload(e, fee.challanNo)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due: {dateStr}</span>
                    </div>

                    {isOutstanding && (
                      <button
                        onClick={() => handlePayFee(fee.challanNo)}
                        disabled={loadingChallan === fee.challanNo}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors duration-200 active:scale-95 disabled:opacity-50 shadow-md shadow-indigo-600/10"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Pay Now
                      </button>
                    )}

                    {isPaid && (
                      <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Settled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transcript Viewer Modal */}
      {viewingTranscript && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a24] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <button
              onClick={() => setViewingTranscript(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-white mb-2 truncate pr-10">{viewingTranscript.name || 'Transcript Attachment'}</h4>
            
            <div className="flex-1 w-full overflow-auto rounded-xl border border-white/5 bg-slate-900 mt-4 flex items-center justify-center min-h-[350px]">
              {viewingTranscript.base64.startsWith('data:application/pdf') ? (
                <iframe
                  src={viewingTranscript.base64}
                  className="w-full h-[450px]"
                  title="PDF Viewer"
                />
              ) : viewingTranscript.base64.startsWith('data:image/') ? (
                <img
                  src={viewingTranscript.base64}
                  alt="Transcript Upload"
                  className="max-w-full max-h-[450px] object-contain p-2"
                />
              ) : (
                <p className="text-xs text-slate-400 p-4">Unable to display format. You can re-upload in standard PNG or JPEG.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
