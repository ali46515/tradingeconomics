import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ChevronDown } from "lucide-react";
import { COUNTRIES } from "@/services/tradingEconomicsAPI.js";
import { capitalizeCountry } from "@/utils/dataFormatter.js";

const CHART_COLORS = [
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-emerald))",
  "hsl(var(--chart-rose))",
  "hsl(var(--chart-amber))",
  "hsl(var(--chart-violet))",
];

const CountrySelector = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const available = COUNTRIES.filter(
    (c) =>
      !selected.includes(c.code) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const addCountry = (code) => {
    if (selected.length < 5) {
      onChange([...selected, code]);
    }
    setSearch("");
    setIsOpen(false);
  };

  const removeCountry = (code) => {
    onChange(selected.filter((c) => c !== code));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Countries
        </h3>
        <span className="font-mono-data text-[11px] text-muted-foreground">
          {selected.length}/4
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {selected.map((code, index) => (
            <motion.div
              key={code}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-data font-medium bg-card shadow-card"
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[index] }}
              />
              <span className="text-foreground">{capitalizeCountry(code)}</span>
              <button
                onClick={() => removeCountry(code)}
                className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {selected.length < 5 && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-data text-muted-foreground border border-dashed border-border hover:border-foreground/30 hover:text-foreground transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add country
              <ChevronDown className="h-3 w-3" />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-56 bg-card rounded-lg shadow-card-hover border border-border z-50">
                <div className="p-2 border-b border-border">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full text-data bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {available.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => addCountry(country.code)}
                      className="w-full text-left px-3 py-2 text-data text-foreground hover:bg-accent transition-colors"
                    >
                      {country.name}
                    </button>
                  ))}
                  {available.length === 0 && (
                    <p className="px-3 py-2 text-data text-muted-foreground">No results</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelector;
