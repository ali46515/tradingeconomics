const API_BASE = "http://localhost:5000/api";


// Supported Countries
export const COUNTRIES = [
  { code: "mexico", name: "Mexico" },
  { code: "new zealand", name: "New Zealand" },
  { code: "sweden", name: "Sweden" },
  { code: "thailand", name: "Thailand" },
];


// Indicators
export const INDICATORS = [
  { id: "gdp", name: "GDP", category: "Output" },
  { id: "gdp growth rate", name: "GDP Growth Rate", category: "Output" },
  { id: "inflation rate", name: "Inflation Rate", category: "Prices" },
  { id: "interest rate", name: "Interest Rate", category: "Money" },
  { id: "unemployment rate", name: "Unemployment Rate", category: "Labour" },
  { id: "population", name: "Population", category: "Health" },
  { id: "exports", name: "Exports", category: "Trade" },
  { id: "imports", name: "Imports", category: "Trade" },
];


// Indicator Search
export const searchIndicators = async (query) => {
  if (!query.trim()) return INDICATORS;

  const filtered = INDICATORS.filter(
    (indicator) =>
      indicator.name.toLowerCase().includes(query.toLowerCase()) ||
      indicator.category.toLowerCase().includes(query.toLowerCase()),
  );

  return filtered.length ? filtered : INDICATORS;
};


// Fetch Historical Data
export const fetchHistoricalData = async (country, indicator) => {
  try {
    const url = `${API_BASE}/historical?country=${encodeURIComponent(country)}&indicator=${encodeURIComponent(indicator)}`;

    const response = await fetch(url, { cache: "no-cache" });

    console.log(response);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) return [];

    const cleanedData = rawData
      .filter((item) => item.Value !== null)
      .map((item) => ({
        date: item.DateTime.split("T")[0],
        value: item.Value,
        country: item.Country,
        indicator: item.Category,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return cleanedData.slice(0, cleanedData.length - 1);
  } catch (error) {
    console.error("Trading Economics API error:", error);

    return [];
  }
};


// Fetch Comparison Data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchComparisonData = async (countries, indicator) => {
  try {
    const results = [];

    for (const country of countries) {
      const data = await fetchHistoricalData(country, indicator);
      results.push(data);
      
      await delay(1000);
    }

    return results.flat();
  } catch (error) {
    console.error("Comparison fetch error:", error);
    return [];
  }
};
