"use client";

import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function StatCards({
  totalBalance,
  totalIncome,
  totalExpenses,
}: StatCardsProps) {
  const cards = [
    {
      label: "Total Balance",
      value: totalBalance,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Monthly Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Monthly Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border ${card.border} ${card.bg} p-5 transition-all duration-300`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg} ${card.color}`}
              >
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <p
              className={`mt-3 text-2xl font-semibold tracking-tight ${card.color}`}
            >
              {formatCurrency(card.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
