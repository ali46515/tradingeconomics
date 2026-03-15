import { formatDate, formatValue, capitalizeCountry } from "@/utils/dataFormatter.js";

const DataTable = ({ data, countries, indicator, isLoading }) => {
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

  const dateMap = {};
  data.forEach((point) => {
    const dateKey = point.date;
    if (!dateMap[dateKey]) dateMap[dateKey] = {};
    dateMap[dateKey][point.country] = point.value;
  });

  const dates = Object.keys(dateMap).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

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
                <th
                  key={c}
                  className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {capitalizeCountry(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.slice(0, 40).map((date, i) => (
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
      {dates.length > 40 && (
        <p className="text-center py-2 text-[11px] text-muted-foreground">
          Showing 40 of {dates.length} records
        </p>
      )}
    </div>
  );
};

export default DataTable;
