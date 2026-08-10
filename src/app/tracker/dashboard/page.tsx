"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import MonthNavigator from "@/components/tracker/MonthNavigator";
import StatCards from "@/components/tracker/StatCards";
import ViewToggle from "@/components/tracker/ViewToggle";
import TransactionModal from "@/components/tracker/TransactionModal";
import TransactionList from "@/components/tracker/TransactionList";
import CalendarView from "@/components/tracker/CalendarView";
import type { Transaction } from "@/components/tracker/TransactionModal";

export default function DashboardPage() {
  const router = useRouter();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [view, setView] = useState<"list" | "calendar">("list");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/tracker/transactions?month=${month}&year=${year}`
      );
      if (res.status === 401) {
        router.push("/tracker/login");
        return;
      }
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(
        data.summary || { totalBalance: 0, totalIncome: 0, totalExpenses: 0 }
      );
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year, router]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(null);
  };

  const handleEditClick = (t: Transaction) => {
    setEditTransaction(t);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditTransaction(null);
    setModalOpen(true);
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const handleLogout = async () => {
    await fetch("/api/tracker/auth/logout", { method: "POST" });
    router.push("/tracker/login");
  };

  // Filter transactions for selected date in calendar view
  const displayTransactions = selectedDate
    ? transactions.filter(
        (t) => t.transaction_date.split("T")[0] === selectedDate
      )
    : transactions;

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fbfbfd]/80 border-b border-zinc-200/50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d1d1f] text-white text-xs font-semibold"
          >
            T
          </Link>
          <MonthNavigator
            month={month}
            year={year}
            onChange={handleMonthChange}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Stats */}
        <StatCards
          totalBalance={summary.totalBalance}
          totalIncome={summary.totalIncome}
          totalExpenses={summary.totalExpenses}
        />

        {/* Toolbar */}
        <div className="mt-8 mb-6 flex items-center justify-between">
          <ViewToggle view={view} onChange={setView} />
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 rounded-xl bg-[#1d1d1f] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#333] hover:shadow-md"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-[#1d1d1f]" />
          </div>
        ) : view === "list" ? (
          <TransactionList
            transactions={displayTransactions}
            onEdit={handleEditClick}
          />
        ) : (
          <div className="space-y-6">
            <CalendarView
              month={month}
              year={year}
              transactions={transactions}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
            />
            {selectedDate && (
              <div>
                <p className="mb-3 text-xs font-medium text-[#86868b] uppercase tracking-wider">
                  Transactions for{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <TransactionList
                  transactions={displayTransactions}
                  onEdit={handleEditClick}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTransaction(null);
        }}
        onSave={fetchTransactions}
        editTransaction={editTransaction}
      />
    </div>
  );
}
