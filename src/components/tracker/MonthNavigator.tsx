"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface MonthNavigatorProps {
  month: number; // 1-12
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthNavigator({
  month,
  year,
  onChange,
}: MonthNavigatorProps) {
  const currentDate = new Date(year, month - 1);

  const goToPrev = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const goToNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={goToPrev}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white text-[#86868b] shadow-sm transition-all duration-200 hover:border-zinc-300 hover:text-[#1d1d1f] hover:shadow"
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </button>
      <h2 className="min-w-[160px] text-center text-lg font-semibold tracking-tight text-[#1d1d1f]">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <button
        onClick={goToNext}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white text-[#86868b] shadow-sm transition-all duration-200 hover:border-zinc-300 hover:text-[#1d1d1f] hover:shadow"
        aria-label="Next month"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
