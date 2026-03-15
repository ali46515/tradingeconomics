import { Download } from "lucide-react";

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const DownloadButton = ({ data }) => {
  if (!data.length) return null;

  const downloadCSV = () => {
    const headers = "Date,Country,Indicator,Value\n";
    const rows = data
      .map((d) => `${d.date},${d.country},${d.indicator},${d.value ?? ""}`)
      .join("\n");
    downloadFile(headers + rows, "economic-data.csv", "text/csv");
  };

  const downloadJSON = () => {
    downloadFile(JSON.stringify(data, null, 2), "economic-data.json", "application/json");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={downloadCSV}
        className="flex items-center gap-1.5 rounded-inner px-3 py-1.5 text-data text-muted-foreground bg-card shadow-card hover:shadow-card-hover hover:text-foreground transition-all"
      >
        <Download className="h-3.5 w-3.5" />
        CSV
      </button>
      <button
        onClick={downloadJSON}
        className="flex items-center gap-1.5 rounded-inner px-3 py-1.5 text-data text-muted-foreground bg-card shadow-card hover:shadow-card-hover hover:text-foreground transition-all"
      >
        <Download className="h-3.5 w-3.5" />
        JSON
      </button>
    </div>
  );
};

export default DownloadButton;
