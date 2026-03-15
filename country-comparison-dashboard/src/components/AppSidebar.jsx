import { BarChart3, Search, Download, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import CountrySelector from "@/components/CountrySelector.jsx";
import IndicatorSearch from "@/components/IndicatorSearch.jsx";
import DownloadButton from "@/components/DownloadButton.jsx";

const AppSidebar = ({
  selectedCountries,
  onCountriesChange,
  selectedIndicator,
  onIndicatorSelect,
  data,
}) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary shrink-0" />
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight">EconInsight</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Indicator Search */}
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>
            <Search className="h-3.5 w-3.5 mr-1.5" />
            {!collapsed && "Indicator"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-2 pb-2">
                <IndicatorSearch
                  selectedIndicator={selectedIndicator}
                  onSelect={onIndicatorSelect}
                  compact
                />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Country Selector */}
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            {!collapsed && "Countries"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-2 pb-2">
                <CountrySelector
                  selected={selectedCountries}
                  onChange={onCountriesChange}
                />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Export */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {!collapsed && "Export"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-2 pb-2">
                <DownloadButton data={data} />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground">
            Economic Indicator Comparison
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
