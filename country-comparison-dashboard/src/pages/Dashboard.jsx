import { useState, useEffect, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.jsx";
import ChartCanvas from "@/components/ChartCanvas.jsx";
import DataTable from "@/components/DataTable.jsx";
import InsightsPanel from "@/components/InsightsPanel.jsx";
import { fetchComparisonData } from "@/services/tradingEconomicsAPI.js";
import { calculateStatistics } from "@/utils/statistics.js";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [selectedCountries, setSelectedCountries] = useState(["united states", "china"]);
  const [selectedIndicator, setSelectedIndicator] = useState({
    id: "gdp growth rate",
    name: "GDP Growth Rate",
    category: "Output",
  });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedCountries.length || !selectedIndicator) return;
    setIsLoading(true);
    try {
      const result = await fetchComparisonData(selectedCountries, selectedIndicator.id);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountries, selectedIndicator]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = calculateStatistics(data);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
          selectedIndicator={selectedIndicator}
          onIndicatorSelect={setSelectedIndicator}
          data={data}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header bar with sidebar trigger */}
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
            <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
              <SidebarTrigger className="shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <BarChart3 className="h-4 w-4 text-primary shrink-0 sm:hidden" />
                <span className="text-data text-muted-foreground truncate hidden sm:inline">
                  Economic Indicator Comparison
                </span>
              </div>
              {selectedIndicator && (
                <div className="ml-auto flex items-center gap-2">
                  <span className="font-mono-data text-[11px] px-2 py-0.5 rounded-pill bg-primary/10 text-primary">
                    {selectedIndicator.name}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
            {/* Title */}
            {selectedIndicator && selectedCountries.length > 0 && (
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                  {selectedIndicator.name}
                </h1>
                <p className="text-data text-muted-foreground mt-0.5">
                  Quarterly time series · {selectedCountries.length}{" "}
                  {selectedCountries.length === 1 ? "country" : "countries"}
                </p>
              </div>
            )}

            {/* Chart */}
            <div className="relative">
              <ChartCanvas
                data={data}
                countries={selectedCountries}
                indicator={selectedIndicator?.id || ""}
                isLoading={isLoading}
              />
            </div>

            {/* Insights */}
            <InsightsPanel
              stats={stats}
              indicator={selectedIndicator?.id || ""}
              countries={selectedCountries}
              isLoading={isLoading}
            />

            {/* Data Table */}
            <DataTable
              data={data}
              countries={selectedCountries}
              indicator={selectedIndicator?.id || ""}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
