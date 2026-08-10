"use client";

import { format, parseISO } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  TrendingUp,
  Laptop,
  Utensils,
  Home,
  Zap,
  Film,
  ShoppingBag,
  Car,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import type { Transaction } from "./TransactionModal";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Salary: Briefcase,
  Investments: TrendingUp,
  Freelance: Laptop,
  Food: Utensils,
  Rent: Home,
  Utilities: Zap,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Transport: Car,
  Healthcare: Heart,
  Other: MoreHorizontal,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TransactionList({
  transactions,
  onEdit,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
          <MoreHorizontal size={20} className="text-[#86868b]" />
        </div>
        <p className="text-sm font-medium text-[#1d1d1f]">
          No transactions yet
        </p>
        <p className="mt-1 text-xs text-[#86868b]">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  // Group transactions by date
  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const dateKey = t.transaction_date.split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          {/* Date header */}
          <p className="mb-2 text-xs font-medium text-[#86868b] uppercase tracking-wider">
            {format(parseISO(dateKey), "EEEE, MMMM d")}
          </p>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
            {grouped[dateKey].map((t, idx) => {
              const Icon = CATEGORY_ICONS[t.category] || MoreHorizontal;
              const isDeposit = t.type === "deposit";

              return (
                <button
                  key={t.id}
                  onClick={() => onEdit(t)}
                  className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-zinc-50 ${
                    idx > 0 ? "border-t border-zinc-100" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isDeposit ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isDeposit ? "text-emerald-600" : "text-red-500"}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {t.category}
                    </p>
                    {t.note && (
                      <p className="mt-0.5 truncate text-xs text-[#86868b]">
                        {t.note}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDeposit ? (
                      <ArrowUpRight size={14} className="text-emerald-600" />
                    ) : (
                      <ArrowDownRight size={14} className="text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        isDeposit ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {isDeposit ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
