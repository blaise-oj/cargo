import PDFDocument from "pdfkit";

export const generateReceiptPDF = (cargo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // --- PDF Content ---
      doc.fontSize(18).text("Cargo Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Airwaybill: ${cargo.airwaybill}`);
      doc.text(`Customer: ${cargo.customerName}`);
      doc.text(`Origin: ${cargo.origin}`);
      doc.text(`Destination: ${cargo.destination}`);
      doc.text(`Weight: ${cargo.weight} kg`);
      doc.text(`Volume: ${cargo.volume} m³`);
      doc.text(`Price: $${cargo.price}`);
      doc.text(`Status: ${cargo.status}`);
      doc.text(`Withdrawn At: ${cargo.withdrawnAt}`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
