import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const API_BASE = process.env.API_BASE;

app.get("/api/historical", async (req, res) => {
  const { country, indicator } = req.query;
  
  if (!country || !indicator) {
    return res.status(400).json({ error: "Missing country or indicator" });
  }
  
  try {
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const url =
      `${base}/historical/country/${encodeURIComponent(country)}` +
      `/indicator/${encodeURIComponent(indicator)}?c=${API_KEY}&f=json`;

    console.log("Fetching:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("TradingEconomics error:", text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Failed to fetch TradingEconomics data",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
