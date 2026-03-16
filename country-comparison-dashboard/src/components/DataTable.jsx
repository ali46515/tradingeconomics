import { useState } from "react";
import { formatDate, formatValue, capitalizeCountry } from "@/utils/dataFormatter.js";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const DataTable = ({ data, countries, indicator, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  if (isLoading) {
    return (
      <div className="w-full rounded-lg shadow-card bg-card p-4">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer rounded h-8" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) return null;

  // Data processing
  const dateMap = {};
  data.forEach((point) => {
    const dateKey = point.date;
    if (!dateMap[dateKey]) dateMap[dateKey] = {};
    dateMap[dateKey][point.country.toLowerCase()] = point.value;
  });

  const dates = Object.keys(dateMap).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Pagination Logic
  const totalPages = Math.ceil(dates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentDates = dates.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full rounded-lg shadow-card bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-data">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              {countries.map((c) => (
                <th key={c} className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {capitalizeCountry(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentDates.map((date, i) => (
              <tr
                key={date}
                className={`border-b border-border/50 transition-colors hover:bg-accent/50 ${
                  i % 2 === 0 ? "bg-card" : "bg-background/50"
                }`}
              >
                <td className="sticky left-0 bg-inherit px-4 py-2.5 font-mono-data text-muted-foreground">
                  {formatDate(date)}
                </td>
                {countries.map((c) => (
                  <td key={c} className="text-right px-4 py-2.5 font-mono-data text-foreground tabular-nums">
                    {formatValue(dateMap[date]?.[c] ?? null, indicator)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-card">
        <div className="text-[11px] text-muted-foreground hidden sm:block">
          Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-foreground">{Math.min(startIndex + rowsPerPage, dates.length)}</span> of{" "}
          <span className="font-medium text-foreground">{dates.length}</span> results
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="px-3 text-xs font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;