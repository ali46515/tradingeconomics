import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatValue, capitalizeCountry } from "@/utils/dataFormatter.js";

const CHART_COLORS = [
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-emerald))",
  "hsl(var(--chart-rose))",
  "hsl(var(--chart-amber))",
  "hsl(var(--chart-violet))",
];

const InsightsPanel = ({ stats, indicator, countries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer rounded-lg h-32" />
        ))}
      </div>
    );
  }

  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat) => {
        const countryIndex = countries.indexOf(stat.country);
        const color = CHART_COLORS[countryIndex] || CHART_COLORS[0];
        const TrendIcon = stat.growth > 1 ? TrendingUp : stat.growth < -1 ? TrendingDown : Minus;

        return (
          <motion.div
            key={stat.country}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="rounded-lg shadow-card bg-card p-4 transition-all hover:shadow-card-hover"
            style={{ transform: "translateY(0)", transition: "transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-data font-semibold text-foreground">
                {capitalizeCountry(stat.country)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Latest</span>
                <span className="font-mono-data text-foreground font-semibold text-lg">
                  {formatValue(stat.latest, indicator)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-data">
                <TrendIcon className="h-3.5 w-3.5" style={{ color: stat.growth > 0 ? "hsl(var(--chart-emerald))" : stat.growth < 0 ? "hsl(var(--chart-rose))" : "hsl(var(--muted-foreground))" }} />
                <span className="font-mono-data" style={{ color: stat.growth > 0 ? "hsl(var(--chart-emerald))" : stat.growth < 0 ? "hsl(var(--chart-rose))" : undefined }}>
                  {stat.growth > 0 ? "+" : ""}{stat.growth}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">μ Mean</p>
                  <p className="font-mono-data text-data text-foreground">{formatValue(stat.mean, indicator)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Min</p>
                  <p className="font-mono-data text-data text-foreground">{formatValue(stat.min, indicator)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Max</p>
                  <p className="font-mono-data text-data text-foreground">{formatValue(stat.max, indicator)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InsightsPanel;
