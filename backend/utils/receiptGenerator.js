import PDFDocument from "pdfkit";

export const generateReceiptPDF = (cargo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 30 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // COLORS
      const accentColor = "#2E7D32"; // Dark Green
      const lightGreen = "#C8E6C9";
      const tableHeaderFill = "#A5D6A7";
      const borderColor = "#2E7D32";

      doc.registerFont("Helvetica-Bold", "Helvetica-Bold");
      doc.registerFont("Helvetica", "Helvetica");

      // STATUS WATERMARK
      if (cargo.status) {
        let color = "gray";
        switch (cargo.status.toUpperCase()) {
          case "BOOKED": color = "gray"; break;
          case "CHECKED IN": color = "orange"; break;
          case "IN TRANSIT": color = "blue"; break;
          case "ARRIVED": color = "green"; break;
          case "WITHDRAWN": color = "red"; break;
        }
        doc.fontSize(80)
          .fillColor(color)
          .opacity(0.15)
          .text(cargo.status.toUpperCase(), 0, 300, { align: "center", width: 595 });
        doc.opacity(1).fillColor("black");
      }

      // HEADER
      doc.rect(30, 30, 535, 50).fillAndStroke(lightGreen, borderColor);
      doc.font("Helvetica-Bold").fontSize(22).fillColor("#000").text("AIR WAYBILL", 40, 40);
      doc.fontSize(12).text("AIRRUSH CHARTERS LTD", 40, 65);
      doc.rect(470, 30, 95, 50).stroke();
      doc.fontSize(10).text(`AWB No: ${cargo.airwaybill}`, 475, 55);

      // SHIPPER & CONSIGNEE
      doc.rect(30, 100, 250, 100).stroke();
      doc.rect(315, 100, 250, 100).stroke();

      doc.fontSize(10).text(`Shipper: ${cargo.customerName}`, 35, 110);
      doc.text(`Email: ${cargo.customerEmail || "-"}`, 35, 125);
      doc.text(`Address: ${cargo.origin.city}, ${cargo.origin.country}`, 35, 140);
      if (cargo.customerAccount) doc.text(`Account No: ${cargo.customerAccount}`, 35, 155);

      doc.text(`Consignee: ${cargo.consigneeName}`, 320, 110);
      doc.text(`Address: ${cargo.destination.city}, ${cargo.destination.country}`, 320, 125);

      // ROUTING & FLIGHT
      doc.rect(30, 220, 535, 40).stroke();
      doc.fontSize(10).text(`Departure: ${cargo.origin.code} (${cargo.origin.city})`, 35, 225);
      doc.text(`Destination: ${cargo.destination.code} (${cargo.destination.city})`, 200, 225);
      doc.text(
        `Routing: ${cargo.route.map((r) => r.city).join(" → ") || cargo.origin.city + " → " + cargo.destination.city}`,
        35,
        240,
        { width: 400 } // ensures long routes wrap nicely
      );
      doc.text(`Flight Date: ${cargo.departureDate ? new Date(cargo.departureDate).toLocaleString() : "-"}`, 400, 225);

      // CARGO DETAILS TABLE
      const tableTop = 270;
      const colX = [30, 80, 150, 230, 310]; // Description gets largest space
      const colWidth = [50, 70, 80, 80, 235]; // perfect alignment
      const columns = ["Qty", "Weight (kg)", "Dimensions cm", "Volume cm³", "Description"];

      // HEADER
      columns.forEach((col, i) => {
        doc.rect(colX[i], tableTop, colWidth[i], 25).fillAndStroke(tableHeaderFill, borderColor);
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#000").text(col, colX[i] + 5, tableTop + 7);
      });

      const cargoDetails = cargo.cargoDetails;
      const dimensions = `${cargoDetails.length}×${cargoDetails.width}×${cargoDetails.height}`;
      const descriptionText = cargoDetails.description || "-";

      // calculate row height based on description
      const rowHeight = Math.max(25, doc.heightOfString(descriptionText, { width: colWidth[4] - 10 }) + 10);

      // ROW CELLS
      const rowData = [
        cargoDetails.quantity,
        cargoDetails.weight,
        dimensions,
        cargoDetails.volume,
        descriptionText
      ];

      rowData.forEach((text, i) => {
        doc.rect(colX[i], tableTop + 25, colWidth[i], rowHeight).stroke();
        if (i === 4) {
          // Description column wraps
          doc.font("Helvetica").fontSize(10)
            .text(text.toString(), colX[i] + 5, tableTop + 25 + 5, { width: colWidth[i] - 10 });
        } else {
          doc.font("Helvetica").fontSize(10)
            .text(text.toString(), colX[i] + 5, tableTop + 25 + 7);
        }
      });

      // CHARGES
      doc.rect(30, tableTop + 25 + rowHeight + 10, 250, 60).stroke();
      doc.fontSize(10).text(`Currency: USD`, 35, tableTop + 25 + rowHeight + 15);
      doc.text(`Weight Charge: $${cargo.price || 0}`, 35, tableTop + 25 + rowHeight + 30);
      doc.text(`Other Charges: $0`, 35, tableTop + 25 + rowHeight + 45);
      doc.text(`Total Charges: $${cargo.price || 0}`, 35, tableTop + 25 + rowHeight + 60);

      // STATUS & HANDLING
      doc.rect(315, tableTop + 25 + rowHeight + 10, 250, 60).stroke();
      doc.fontSize(10).text(`Status: ${cargo.status}`, 320, tableTop + 25 + rowHeight + 15);
      if (cargo.withdrawReason) doc.text(`Withdraw Reason: ${cargo.withdrawReason}`, 320, tableTop + 25 + rowHeight + 30);
      if (cargo.withdrawnAt) doc.text(`Withdrawn At: ${new Date(cargo.withdrawnAt).toLocaleString()}`, 320, tableTop + 25 + rowHeight + 45);

      // DATES & SIGNATURE
      const bottomY = tableTop + 25 + rowHeight + 80;
      doc.rect(30, bottomY, 535, 40).stroke();
      doc.fontSize(10).text(`Issued Date: ${new Date(cargo.createdAt).toLocaleString()}`, 35, bottomY + 5);
      doc.text(`Place of Issue: ${cargo.origin.city}`, 200, bottomY + 5);
      doc.text(`Signature: For Airrush Charters Ltd`, 400, bottomY + 5);

      doc.end();
    } catch (err) {
      console.error("PDF generation failed:", err);
      reject(err);
    }
  });
};
