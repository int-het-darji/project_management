import { FiDownload, FiPrinter } from "react-icons/fi";

const ExportButtons = ({ data }) => {
  const exportCSV = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((r) => Object.values(r).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "project-progress.csv";
    a.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportCSV}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        <FiDownload /> CSV
      </button>

      <button
        onClick={exportPDF}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-black"
      >
        <FiPrinter /> PDF
      </button>
    </div>
  );
};

export default ExportButtons;
