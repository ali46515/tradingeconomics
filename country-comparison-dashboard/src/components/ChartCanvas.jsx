import { useState, useRef, useMemo, useCallback } from "react";
import { createLinearScale, createTimeScale, getValueBounds, generateTicks, generateDateTicks } from "@/utils/chartScaler.js";
import { formatDate, formatValue, capitalizeCountry } from "@/utils/dataFormatter.js";

const CHART_COLORS = [
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-emerald))",
  "hsl(var(--chart-rose))",
  "hsl(var(--chart-amber))",
  "hsl(var(--chart-violet))",
];

const PADDING = { top: 24, right: 24, bottom: 40, left: 72 };

const ChartCanvas = ({ data, countries, indicator, isLoading }) => {
  const svgRef = useRef(null);
  const [mouseX, setMouseX] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  const width = 800;
  const height = 400;
  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  const { grouped, allDates, scaleX, scaleY, yTicks, dateTicks } = useMemo(() => {
    const grouped = {};
    countries.forEach((c) => {
      grouped[c] = data
        .filter((d) => d.country === c && d.value !== null)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    const allValues = data.filter((d) => d.value !== null).map((d) => d.value);
    const allDateObjs = [...new Set(data.map((d) => d.date))].map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
    const bounds = getValueBounds(allValues);

    return {
      grouped,
      allDates: allDateObjs,
      scaleX: createTimeScale(allDateObjs, PADDING.left, PADDING.left + chartW),
      scaleY: createLinearScale(bounds.min, bounds.max, PADDING.top + chartH, PADDING.top),
      yTicks: generateTicks(bounds.min, bounds.max, 6),
      dateTicks: generateDateTicks(allDateObjs, 6),
    };
  }, [data, countries, chartW, chartH]);

  const generatePath = useCallback(
    (points) => {
      if (!points.length) return "";
      return points
        .map((d, i) => {
          const x = scaleX(new Date(d.date));
          const y = scaleY(d.value);
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(" ");
    },
    [scaleX, scaleY]
  );

  const handleMouseMove = useCallback(
    (e) => {
      const svg = svgRef.current;
      if (!svg || !allDates.length) return;
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;

      if (svgX < PADDING.left || svgX > PADDING.left + chartW) {
        setMouseX(null);
        setTooltipData(null);
        return;
      }

      setMouseX(svgX);

      let nearestDate = allDates[0];
      let minDist = Infinity;
      allDates.forEach((d) => {
        const dx = Math.abs(scaleX(d) - svgX);
        if (dx < minDist) {
          minDist = dx;
          nearestDate = d;
        }
      });

      const dateStr = nearestDate.toISOString().split("T")[0];
      const values = countries.map((c, i) => {
        const point = grouped[c]?.find(
          (p) => p.date === dateStr || new Date(p.date).toISOString().split("T")[0] === dateStr
        );
        if (!point && grouped[c]?.length) {
          const nearestPoint = grouped[c].reduce((prev, curr) =>
            Math.abs(new Date(curr.date).getTime() - nearestDate.getTime()) <
            Math.abs(new Date(prev.date).getTime() - nearestDate.getTime())
              ? curr
              : prev
          );
          return { country: c, value: nearestPoint.value, color: CHART_COLORS[i] };
        }
        return { country: c, value: point?.value, color: CHART_COLORS[i] };
      }).filter((v) => v.value !== undefined && v.value !== null);

      setTooltipData({ date: dateStr, values });
    },
    [allDates, scaleX, countries, grouped, chartW, width]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setTooltipData(null);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full rounded-lg shadow-card bg-card p-6">
        <div className="skeleton-shimmer rounded-md" style={{ width: "100%", height: 400 }} />
      </div>
    );
  }

  if (!data.length || !countries.length) {
    return (
      <div className="w-full rounded-lg shadow-card bg-card flex items-center justify-center" style={{ height: 400 }}>
        <p className="text-muted-foreground text-data">
          Search and select up to 5 countries to begin analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg shadow-card bg-card p-4 transition-shadow hover:shadow-card-hover" style={{ transform: "translateY(0)", transition: "transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms" }}>
      <div className="flex items-center gap-4 mb-4 px-2">
        {countries.map((c, i) => (
          <div key={c} className="flex items-center gap-1.5 text-data text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
            <span>{capitalizeCountry(c)}</span>
          </div>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={scaleY(tick)}
              x2={PADDING.left + chartW}
              y2={scaleY(tick)}
              stroke="hsl(var(--border))"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 8}
              y={scaleY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            >
              {formatValue(tick, indicator)}
            </text>
          </g>
        ))}

        {dateTicks.map((date) => (
          <text
            key={date.getTime()}
            x={scaleX(date)}
            y={PADDING.top + chartH + 24}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          >
            {formatDate(date.toISOString().split("T")[0])}
          </text>
        ))}

        {countries.map((c, i) => {
          const points = grouped[c] || [];
          const path = generatePath(points);
          if (!path) return null;
          return (
            <path
              key={c}
              d={path}
              fill="none"
              stroke={CHART_COLORS[i]}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {mouseX !== null && (
          <line
            x1={mouseX}
            y1={PADDING.top}
            x2={mouseX}
            y2={PADDING.top + chartH}
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            opacity={0.2}
          />
        )}

        {tooltipData?.values.map((v) => {
          const points = grouped[v.country] || [];
          if (!points.length) return null;
          const nearestPoint = points.reduce((prev, curr) =>
            Math.abs(new Date(curr.date).getTime() - new Date(tooltipData.date).getTime()) <
            Math.abs(new Date(prev.date).getTime() - new Date(tooltipData.date).getTime())
              ? curr
              : prev
          );
          if (!nearestPoint) return null;
          return (
            <circle
              key={v.country}
              cx={scaleX(new Date(nearestPoint.date))}
              cy={scaleY(nearestPoint.value)}
              r="4"
              fill={v.color}
              stroke="hsl(var(--card))"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {tooltipData && mouseX !== null && (
        <div
          className="absolute bg-card rounded-inner shadow-card-hover border border-border p-2.5 pointer-events-none z-50"
          style={{
            left: `${Math.min((mouseX / width) * 100, 75)}%`,
            top: 60,
          }}
        >
          <p className="font-mono-data text-[11px] text-muted-foreground mb-1">
            {formatDate(tooltipData.date)}
          </p>
          {tooltipData.values.map((v) => (
            <div key={v.country} className="flex items-center gap-2 text-data">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v.color }} />
              <span className="text-muted-foreground">{capitalizeCountry(v.country)}</span>
              <span className="font-mono-data font-medium text-foreground ml-auto pl-3">
                {formatValue(v.value, indicator)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCanvas;
