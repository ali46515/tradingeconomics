// Trading Economics API Service

const API_BASE = "https://api.tradingeconomics.com";
const SEARCH_BASE = "https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade";

const API_KEY = "";

export const COUNTRIES = [
  { code: "united states", name: "United States" },
  { code: "china", name: "China" },
  { code: "india", name: "India" },
  { code: "germany", name: "Germany" },
  { code: "united kingdom", name: "United Kingdom" },
  { code: "france", name: "France" },
  { code: "japan", name: "Japan" },
  { code: "brazil", name: "Brazil" },
  { code: "canada", name: "Canada" },
  { code: "australia", name: "Australia" },
  { code: "pakistan", name: "Pakistan" },
  { code: "indonesia", name: "Indonesia" },
  { code: "mexico", name: "Mexico" },
  { code: "south korea", name: "South Korea" },
  { code: "turkey", name: "Turkey" },
  { code: "saudi arabia", name: "Saudi Arabia" },
  { code: "south africa", name: "South Africa" },
  { code: "russia", name: "Russia" },
  { code: "italy", name: "Italy" },
  { code: "spain", name: "Spain" },
];

export const INDICATORS = [
  { id: "gdp", name: "GDP", category: "Output" },
  { id: "gdp growth rate", name: "GDP Growth Rate", category: "Output" },
  { id: "gdp per capita", name: "GDP Per Capita", category: "Output" },
  { id: "inflation rate", name: "Inflation Rate", category: "Prices" },
  { id: "interest rate", name: "Interest Rate", category: "Money" },
  { id: "unemployment rate", name: "Unemployment Rate", category: "Labour" },
  { id: "population", name: "Population", category: "Health" },
  { id: "government debt to gdp", name: "Government Debt to GDP", category: "Government" },
  { id: "exports", name: "Exports", category: "Trade" },
  { id: "imports", name: "Imports", category: "Trade" },
  { id: "current account to gdp", name: "Current Account to GDP", category: "Trade" },
  { id: "consumer confidence", name: "Consumer Confidence", category: "Consumer" },
];

export const searchIndicators = async (query) => {
  if (!query.trim()) return INDICATORS;
  const filtered = INDICATORS.filter(
    (ind) =>
      ind.name.toLowerCase().includes(query.toLowerCase()) ||
      ind.category.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.length > 0 ? filtered : INDICATORS;
};

const generateMockData = (country, indicator, years = 10) => {
  const data = [];
  const now = new Date();
  const baseValues = {
    "gdp": {
      "united states": 21000, china: 14000, india: 2800, germany: 3800, "united kingdom": 2700,
      japan: 5000, brazil: 1800, pakistan: 300, france: 2600, canada: 1700, default: 1000,
    },
    "gdp growth rate": {
      "united states": 2.3, china: 6.1, india: 5.5, germany: 1.5, "united kingdom": 1.8,
      japan: 0.8, brazil: 1.1, pakistan: 3.2, france: 1.6, canada: 1.9, default: 2.0,
    },
    "inflation rate": {
      "united states": 3.2, china: 2.1, india: 5.4, germany: 2.8, "united kingdom": 4.1,
      japan: 0.5, brazil: 4.5, pakistan: 9.7, france: 2.5, canada: 2.9, default: 3.0,
    },
    "unemployment rate": {
      "united states": 3.7, china: 5.2, india: 7.1, germany: 3.1, "united kingdom": 4.0,
      japan: 2.6, brazil: 8.9, pakistan: 6.3, france: 7.4, canada: 5.4, default: 5.0,
    },
    "interest rate": {
      "united states": 5.25, china: 3.45, india: 6.5, germany: 4.5, "united kingdom": 5.0,
      japan: -0.1, brazil: 13.75, pakistan: 22.0, france: 4.5, canada: 4.75, default: 4.0,
    },
    "population": {
      "united states": 331, china: 1412, india: 1408, germany: 84, "united kingdom": 67,
      japan: 125, brazil: 215, pakistan: 230, france: 68, canada: 39, default: 50,
    },
  };

  const indicatorKey = indicator.toLowerCase();
  const countryKey = country.toLowerCase();
  const baseMap = baseValues[indicatorKey] || baseValues["gdp growth rate"];
  const base = baseMap[countryKey] || baseMap["default"];

  for (let i = years * 4; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i * 3);
    const variance = (Math.random() - 0.5) * base * 0.15;
    const trend = (years * 4 - i) * base * 0.005;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round((base + variance + trend) * 100) / 100,
      country: country,
      indicator: indicator,
    });
  }

  return data;
};

export const fetchHistoricalData = async (country, indicator) => {
  if (API_KEY) {
    try {
      const url = `${API_BASE}/historical/country/${encodeURIComponent(country)}/indicator/${encodeURIComponent(indicator)}?c=${API_KEY}&f=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.map((d) => ({
        date: d.DateTime?.split("T")[0] || d.Date,
        value: d.Value,
        country: country,
        indicator: indicator,
      }));
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData(country, indicator));
    }, 600 + Math.random() * 800);
  });
};

export const fetchComparisonData = async (countries, indicator) => {
  const promises = countries.map((country) => fetchHistoricalData(country, indicator));
  const results = await Promise.all(promises);
  return results.flat();
};
