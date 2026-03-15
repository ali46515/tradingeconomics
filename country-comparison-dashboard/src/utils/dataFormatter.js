import { format, parseISO } from "date-fns";

export const formatDate = (dateStr, fmt = "MMM yyyy") => {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
};

export const formatValue = (value, indicator) => {
  if (value === null || value === undefined) return "—";
  const ind = (indicator || "").toLowerCase();
  if (ind.includes("gdp") && !ind.includes("rate") && !ind.includes("per capita") && !ind.includes("to gdp")) {
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}T`;
    return `$${value.toFixed(0)}B`;
  }
  if (ind.includes("rate") || ind.includes("inflation") || ind.includes("to gdp")) {
    return `${value.toFixed(1)}%`;
  }
  if (ind.includes("population")) {
    if (value >= 1000) return `${(value / 1000).toFixed(2)}B`;
    return `${value.toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(2);
};

export const capitalizeCountry = (country) => {
  return country
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
