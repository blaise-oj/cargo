import PDFDocument from "pdfkit";

// ✅ Force Nairobi time everywhere (fixes domain vs localhost issue)
const formatDate = (date) => {
  if (!date) return "-";
  return (
    new Date(date).toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " hrs"
  );
};

export const generateReceiptPDF = (cargo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 30 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // COLORS
      const lightGreen = "#C8E6C9";
      const tableHeaderFill = "#A5D6A7";
      const borderColor = "#2E7D32";

      doc.registerFont("Helvetica-Bold", "Helvetica-Bold");
      doc.registerFont("Helvetica", "Helvetica");

      // ======================
      // STATUS WATERMARK
      // ======================
      if (cargo.status) {
        let color = "gray";
        switch (cargo.status.toUpperCase()) {
          case "CHECKED IN": color = "orange"; break;
          case "IN TRANSIT": color = "blue"; break;
          case "ARRIVED": color = "green"; break;
          case "WITHDRAWN": color = "red"; break;
          case "DELAYED": color = "purple"; break;
        }

        doc.fontSize(80)
          .fillColor(color)
          .opacity(0.15)
          .text(cargo.status.toUpperCase(), 0, 300, {
            align: "center",
            width: 595,
          });

        doc.opacity(1).fillColor("black");
      }

      // ======================
      // HEADER
      // ======================
      doc.rect(30, 30, 535, 50).fillAndStroke(lightGreen, borderColor);
      doc.fillColor("black");

      doc.font("Helvetica-Bold").fontSize(22).text("AIR WAYBILL", 40, 40);
      doc.fontSize(12).text("AIRRUSH CHARTERS LTD", 40, 65);

      doc.rect(470, 30, 95, 50).stroke();
      doc.fontSize(10).text(`AWB No: ${cargo.airwaybill}`, 475, 55);

      // ======================
      // SHIPPER & CONSIGNEE
      // ======================
      doc.rect(30, 100, 250, 100).stroke();
      doc.rect(315, 100, 250, 100).stroke();

      doc.fontSize(10)
        .text(`Shipper: ${cargo.customerName}`, 35, 110)
        .text(`Email: ${cargo.customerEmail}`, 35, 125)
        .text(`Address: ${cargo.origin.city}, ${cargo.origin.country}`, 35, 140);

      doc.text(`Consignee: -`, 320, 110);
      doc.text(`Address: ${cargo.destination.city}, ${cargo.destination.country}`, 320, 125);

      // ======================
      // ROUTING & FLIGHT
      // ======================
      doc.rect(30, 220, 535, 40).stroke();
      doc.fontSize(10)
        .text(`Origin: ${cargo.origin.city}`, 35, 225)
        .text(`Destination: ${cargo.destination.city}`, 220, 225)
        .text(`Routing: ${cargo.origin.city} → ${cargo.destination.city}`, 35, 240)
        .text(`Flight Date: ${formatDate(cargo.departureDate)}`, 380, 225);

      // ======================
      // CARGO DETAILS TABLE
      // ======================
      const tableTop = 270;
      const colX = [30, 80, 150, 230, 310];
      const colW = [50, 70, 80, 80, 235];
      const headers = ["Qty", "Weight (kg)", "Dimensions (cm)", "Volume (cm³)", "Cargo Description"];

      headers.forEach((h, i) => {
        doc.rect(colX[i], tableTop, colW[i], 25).fillAndStroke(tableHeaderFill, borderColor);
        doc.fillColor("black");
        doc.font("Helvetica-Bold").fontSize(10).text(h, colX[i] + 5, tableTop + 7);
      });

      const d = cargo.cargoDetails;
      const description = d.description || "-";
      const rowHeight = Math.max(
        30,
        doc.heightOfString(description, { width: colW[4] - 10 }) + 10
      );

      const row = [
        d.quantity,
        d.weight,
        `${d.length}×${d.width}×${d.height}`,
        d.volume,
        description,
      ];

      row.forEach((cell, i) => {
        doc.rect(colX[i], tableTop + 25, colW[i], rowHeight).stroke();
        doc.font("Helvetica").fontSize(10).text(
          cell.toString(),
          colX[i] + 5,
          tableTop + 30,
          i === 4 ? { width: colW[i] - 10 } : {}
        );
      });

      // ======================
      // CHARGES
      // ======================
      const chargesTop = tableTop + 25 + rowHeight + 10;
      doc.rect(30, chargesTop, 250, 60).stroke();
      doc.fontSize(10)
        .text("Currency: USD", 35, chargesTop + 10)
        .text(`Total Charges: $${cargo.price}`, 35, chargesTop + 30);

      // ======================
      // STATUS INFORMATION
      // ======================
      const statusTop = chargesTop + 80;
      doc.rect(30, statusTop, 535, 120).stroke();
      doc.font("Helvetica-Bold").text("Status Information", 35, statusTop + 8);

      let y = statusTop + 28;
      doc.font("Helvetica").text(`Current Status: ${cargo.status}`, 35, y);
      y += 16;

      if (cargo.status === "Delayed") {
        doc.text(`Delayed At: ${formatDate(cargo.delayedAt)}`, 35, y);
        y += 16;
        doc.text(
          `Delay Reason: ${cargo.delayReason || "-"}`,
          35,
          y,
          { width: 495 }
        );
      }

      if (cargo.status === "Withdrawn") {
        doc.text(`Withdrawn At: ${formatDate(cargo.withdrawnAt)}`, 35, y);
        y += 16;
        doc.text(
          `Withdraw Reason: ${cargo.withdrawReason || "-"}`,
          35,
          y,
          { width: 495 }
        );
      }

      // ======================
      // FOOTER
      // ======================
      const footerY = statusTop + 150;
      doc.rect(30, footerY, 535, 40).stroke();
      doc.fontSize(10)
        .text(`Issued Date: ${formatDate(cargo.createdAt)}`, 35, footerY + 10)
        .text(`Place of Issue: ${cargo.origin.city}`, 220, footerY + 10)
        .text("Signature: For Airrush Charters Ltd", 380, footerY + 10);

      doc.end();
    } catch (err) {
      console.error("PDF generation failed:", err);
      reject(err);
    }
  });
};
