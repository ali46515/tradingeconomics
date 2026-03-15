import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { INDICATORS } from "@/services/tradingEconomicsAPI.js";

const IndicatorSearch = ({ selectedIndicator, onSelect, compact }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = INDICATORS.filter(
    (ind) =>
      ind.name.toLowerCase().includes(query.toLowerCase()) ||
      ind.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((indicator) => {
    onSelect(indicator);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onSelect]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-inner bg-card px-3 py-2 easing-linear"
        style={{
          width: compact ? "100%" : (isFocused ? 400 : 280),
          transition: compact ? "box-shadow 150ms ease" : "width 200ms cubic-bezier(0.2, 0, 0, 1), box-shadow 150ms ease",
          boxShadow: isFocused
            ? "0 0 0 1px hsl(var(--primary)), 0 0 0 4px hsl(var(--primary) / 0.1)"
            : "var(--shadow-card)",
        }}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={selectedIndicator ? selectedIndicator.name : "Search indicators..."}
          className="flex-1 bg-transparent text-data text-foreground placeholder:text-muted-foreground outline-none min-w-0"
        />
        {!isFocused && !compact && (
          <span className="font-mono-data text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
            ⌘K
          </span>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-card rounded-lg shadow-card-hover border border-border z-50 max-h-64 overflow-y-auto">
          {filtered.map((indicator) => (
            <button
              key={indicator.id}
              onMouseDown={() => handleSelect(indicator)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-data transition-colors hover:bg-accent ${
                selectedIndicator?.id === indicator.id ? "bg-accent" : ""
              }`}
            >
              <span className="text-foreground font-medium">{indicator.name}</span>
              <span className="text-[11px] text-muted-foreground font-mono-data">{indicator.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndicatorSearch;
