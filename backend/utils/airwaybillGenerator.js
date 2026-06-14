import PDFDocument from "pdfkit";

export const generateAirwaybillPDF = (cargo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 15,
      });

      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const GREEN = "#008000";

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 15;

      const cell = (x, y, w, h, text = "") => {
        doc.rect(x, y, w, h).stroke(GREEN);

        if (text) {
          doc
            .fontSize(7)
            .fillColor("black")
            .text(text, x + 3, y + 3, {
              width: w - 6,
            });
        }
      };

      doc.lineWidth(0.5);

      // ======================================
      // HEADER
      // ======================================

      doc
        .fontSize(22)
        .fillColor("#006400")
        .text("AIRRUSH CHARTERS LTD", 0, 20, {
          align: "center",
        });

      doc
        .fontSize(10)
        .fillColor("black")
        .text("International Air Cargo Services", 0, 48, {
          align: "center",
        });

      doc
        .moveTo(margin, 65)
        .lineTo(pageWidth - margin, 65)
        .stroke("#006400");

      // ======================================
      // OUTER BORDER (FIXED)
      // ======================================

      cell(
        margin,
        margin,
        pageWidth - margin * 2,
        pageHeight - margin * 2
      );

      // ======================================
      // TOP SECTION
      // ======================================

      cell(10, 10, 250, 110, "SHIPPER");
      cell(260, 10, 250, 110, "CONSIGNEE");
      cell(510, 10, 70, 110, "AIR WAYBILL");

      cell(10, 120, 300, 60, "ISSUING CARRIER AGENT");
      cell(310, 120, 150, 60, "AGENT IATA CODE");
      cell(460, 120, 120, 60, "ACCOUNT NUMBER");

      cell(10, 180, pageWidth - margin * 2, 50, "AIRPORT OF DEPARTURE");

      // ======================================
      // ROUTING
      // ======================================

      cell(10, 230, 100, 40, "TO");
      cell(110, 230, 100, 40, "BY");

      cell(210, 230, 100, 40, "TO");
      cell(310, 230, 100, 40, "BY");

      cell(410, 230, 100, 40, "TO");
      cell(510, 230, 100, 40, "BY");

      cell(610, 230, pageWidth - 620, 40, "FLIGHT / DATE");

      // ======================================
      // ACCOUNTING INFO
      // ======================================

      cell(10, 270, pageWidth - margin * 2, 50, "ACCOUNTING INFORMATION");

      // ======================================
      // GOODS TABLE
      // ======================================

      const goodsTop = 320;

      cell(10, goodsTop, 60, 30, "PCS");
      cell(70, goodsTop, 80, 30, "GROSS WT");
      cell(150, goodsTop, 40, 30, "KG");
      cell(190, goodsTop, 80, 30, "RATE CLASS");
      cell(270, goodsTop, 120, 30, "CHARGEABLE WT");
      cell(390, goodsTop, 80, 30, "RATE");
      cell(470, goodsTop, 80, 30, "TOTAL");
      cell(550, goodsTop, pageWidth - 560, 30, "NATURE & QUANTITY OF GOODS");

      cell(10, goodsTop + 30, 60, 130);
      cell(70, goodsTop + 30, 80, 130);
      cell(150, goodsTop + 30, 40, 130);
      cell(190, goodsTop + 30, 80, 130);
      cell(270, goodsTop + 30, 120, 130);
      cell(390, goodsTop + 30, 80, 130);
      cell(470, goodsTop + 30, 80, 130);
      cell(550, goodsTop + 30, pageWidth - 560, 130);

      // ======================================
      // CHARGES
      // ======================================

      const chargesTop = 480;

      cell(10, chargesTop, 140, 50, "PREPAID");
      cell(150, chargesTop, 140, 50, "COLLECT");
      cell(290, chargesTop, 140, 50, "VALUATION");
      cell(430, chargesTop, 140, 50, "TAX");
      cell(570, chargesTop, pageWidth - 580, 50, "TOTAL CHARGES");

      // ======================================
      // CERTIFICATION
      // ======================================

      const certTop = 530;

      cell(10, certTop, 550, 80, "CERTIFICATION OF SHIPPER");
      cell(560, certTop, pageWidth - 570, 80, "CARRIER EXECUTION");

      // ======================================
      // SIGNATURES
      // ======================================

      const signTop = 610;

      cell(10, signTop, 270, 60, "SHIPPER SIGNATURE");
      cell(280, signTop, 270, 60, "AGENT SIGNATURE");
      cell(550, signTop, pageWidth - 560, 60, "CARRIER SIGNATURE");

      // ======================================
      // FOOTER (FIXED PROPERLY)
      // ======================================

      const footerY = pageHeight - 40;

      doc
        .moveTo(margin, footerY)
        .lineTo(pageWidth - margin, footerY)
        .stroke("#006400");

      doc
        .fontSize(8)
        .fillColor("black")
        .text(
          "Airrush Charters Ltd | Cargo Operations Department",
          margin,
          footerY + 8,
          {
            width: pageWidth - margin * 2,
            align: "center",
          }
        );

      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        margin,
        footerY + 20,
        {
          width: pageWidth - margin * 2,
          align: "center",
        }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};