// ExportaPDFButton.tsx
import React from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

interface ExportaPDFButtonProps {
  targetId: string; // id del div/taula que vols exportar
  fileName?: string;
}

export const ExportaPDFButton: React.FC<ExportaPDFButtonProps> = ({
  targetId,
  fileName = "taula.pdf",
}) => {

  const handleExport = async () => {
    const node = document.getElementById(targetId);
    if (!node) {
      console.error("No s'ha trobat l'element amb id:", targetId);
      return;
    }

    try {
      // Convertim el node DOM a PNG
      const dataUrl = await domtoimage.toPng(node, {
        quality: 1,
        bgcolor: "#ffffff", // fons blanc si vols
        // opcional: width, height, style, filter, etc.
      });

      // Creem un PDF amb jsPDF
      const pdf = new jsPDF({
        orientation: "landscape", // o 'portrait'
        unit: "px",
        format: [node.offsetWidth, node.offsetHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, node.offsetWidth, node.offsetHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error("Error exportant PDF:", error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Exporta PDF
    </button>
  );
};


