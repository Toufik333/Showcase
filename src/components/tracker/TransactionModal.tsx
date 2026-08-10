"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { format } from "date-fns";

export interface Transaction {
  id: number;
  type: "deposit" | "withdraw";
  amount: number;
  category: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editTransaction?: Transaction | null;
}

const CATEGORIES = [
  "Salary",
  "Investments",
  "Freelance",
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Transport",
  "Healthcare",
  "Other",
];

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  editTransaction,
}: TransactionModalProps) {
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!editTransaction;

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(String(editTransaction.amount));
      setCategory(editTransaction.category);
      setNote(editTransaction.note || "");
      setDate(editTransaction.transaction_date.split("T")[0]);
    } else {
      setType("deposit");
      setAmount("");
      setCategory("Salary");
      setNote("");
      setDate(format(new Date(), "yyyy-MM-dd"));
    }
    setError("");
  }, [editTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const body = {
        type,
        amount: parseFloat(amount),
        category,
        note: note || null,
        transaction_date: date,
      };

      const url = isEditing
        ? `/api/tracker/transactions/${editTransaction.id}`
        : "/api/tracker/transactions";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save transaction");
        setLoading(false);
        return;
      }

      onSave();
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editTransaction) return;
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/tracker/transactions/${editTransaction.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        setError("Failed to delete transaction");
        setLoading(false);
        return;
      }

      onSave();
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#86868b] transition-colors hover:bg-zinc-100 hover:text-[#1d1d1f]"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl border border-zinc-200/80 bg-zinc-50 p-1">
            <button
              type="button"
              onClick={() => setType("deposit")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                type === "deposit"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setType("withdraw")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                type === "withdraw"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#86868b]">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200/80 bg-white py-3 pl-8 pr-4 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider">
              Note <span className="normal-case text-zinc-400">(optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              placeholder="Add a note..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-500 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#1d1d1f] py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Transaction"
                : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
