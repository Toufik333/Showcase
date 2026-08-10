"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import type { Transaction } from "./TransactionModal";

interface CalendarViewProps {
  month: number;
  year: number;
  transactions: Transaction[];
  onDayClick: (dateStr: string) => void;
  selectedDate: string | null;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000) {
    return (value > 0 ? "+" : "") + (value / 1000).toFixed(1) + "k";
  }
  return (value > 0 ? "+" : "") + value.toFixed(0);
}

export default function CalendarView({
  month,
  year,
  transactions,
  onDayClick,
  selectedDate,
}: CalendarViewProps) {
  const monthDate = new Date(year, month - 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Build daily totals
  const dailyTotals: Record<string, { income: number; expenses: number; count: number }> = {};
  transactions.forEach((t) => {
    const key = t.transaction_date.split("T")[0];
    if (!dailyTotals[key]) {
      dailyTotals[key] = { income: 0, expenses: 0, count: 0 };
    }
    dailyTotals[key].count++;
    if (t.type === "deposit") {
      dailyTotals[key].income += Number(t.amount);
    } else {
      dailyTotals[key].expenses += Number(t.amount);
    }
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[11px] font-medium text-[#86868b] uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, monthDate);
          const today = isToday(day);
          const data = dailyTotals[dateStr];
          const net = data ? data.income - data.expenses : 0;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => inMonth && onDayClick(dateStr)}
              disabled={!inMonth}
              className={`relative flex min-h-[80px] flex-col items-center border-b border-r border-zinc-50 p-1.5 text-left transition-colors duration-150 ${
                inMonth
                  ? "hover:bg-zinc-50 cursor-pointer"
                  : "bg-zinc-50/50 cursor-default"
              } ${isSelected ? "bg-blue-50 hover:bg-blue-50" : ""}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  today
                    ? "bg-[#1d1d1f] text-white"
                    : inMonth
                    ? "text-[#1d1d1f]"
                    : "text-zinc-300"
                }`}
              >
                {format(day, "d")}
              </span>

              {data && inMonth && (
                <div className="mt-1 flex flex-col items-center gap-0.5">
                  {data.income > 0 && (
                    <span className="text-[10px] font-medium text-emerald-600">
                      +{data.income.toFixed(0)}
                    </span>
                  )}
                  {data.expenses > 0 && (
                    <span className="text-[10px] font-medium text-red-500">
                      −{data.expenses.toFixed(0)}
                    </span>
                  )}
                  {data.count > 0 && (
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-medium text-[#86868b]">
                      {data.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
