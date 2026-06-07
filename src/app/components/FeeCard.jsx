'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Calendar, DollarSign, Wallet } from 'lucide-react';

export default function FeeCard({ fees, onUpdate }) {
  const [loadingChallan, setLoadingChallan] = useState(null);
  const [error, setError] = useState('');

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
          Fee Challan Statements
        </h3>

        {fees.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-sm text-slate-400">No fee records found for this registration number.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`border rounded-xl p-5 backdrop-blur-md flex flex-col justify-between h-48 transition-all duration-300 hover:scale-[1.01] ${
                    isPaid
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                        {fee.semester}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">Rs. {fee.amount.toLocaleString()}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Challan Ref: {fee.challanNo}</p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due: {dateStr}</span>
                    </div>

                    {isOutstanding && (
                      <button
                        onClick={() => handlePayFee(fee.challanNo)}
                        disabled={loadingChallan === fee.challanNo}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors duration-200 active:scale-95 disabled:opacity-50"
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
    </div>
  );
}
