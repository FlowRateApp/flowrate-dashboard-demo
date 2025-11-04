/**
 * CSV Export Hook
 * Client-side CSV generation and download
 */

export function useExportCSV() {
  const exportToCSV = (data: unknown[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = (row as Record<string, unknown>)[header];
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        // Stringify with quotes if contains comma or newline
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes("\n")) {
          return JSON.stringify(stringValue);
        }
        return stringValue;
      }).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return { exportToCSV };
}

