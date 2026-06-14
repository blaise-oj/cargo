import PDFDocument from "pdfkit";

const formatDate = (date) => {
  if (!date) return "";
  return (
    new Date(date).toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " EAT"
  );
};

export const generateReceiptPDF = (cargo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 15,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const GREEN = "#0B7A20";
      const LIGHT_GREEN = "#E8F6E8";

      const pageW = doc.page.width;
      const pageH = doc.page.height;
      const left = 20;
      const width = pageW - 40;

      const d = cargo.cargoDetails || {};
      const c = cargo.charges || {};
      const awb = cargo.awbDetails || {};
      const shipper = cargo.shipper || {};
      const consignee = cargo.consignee || {};
      const flight = cargo.flightDetails || {};

      const safe = (v, fallback = "-") =>
        v !== undefined && v !== null && v !== "" ? String(v) : fallback;

      const box = (x, y, w, h, title = "", value = "", opts = {}) => {
        if (opts.fill) {
          doc.rect(x, y, w, h).fillAndStroke(opts.fill, GREEN);
        } else {
          doc.rect(x, y, w, h).stroke(GREEN);
        }

        if (title) {
          doc
            .font("Helvetica-Bold")
            .fontSize(opts.titleSize || 5.4)
            .fillColor(GREEN)
            .text(title, x + 2, y + 2, {
              width: w - 4,
              height: opts.titleHeight || 12,
            });
        }

        if (value !== "") {
          doc
            .font("Helvetica")
            .fontSize(opts.valueSize || 6.4)
            .fillColor("black")
            .text(String(value), x + 3, y + (opts.valueY || 15), {
              width: w - 6,
              height: h - (opts.valueY || 15) - 2,
            });
        }
      };

      const centerText = (txt, y, size = 9, bold = false, color = "black") => {
        doc
          .font(bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(size)
          .fillColor(color)
          .text(txt, left, y, { width, align: "center" });
      };

      doc.lineWidth(0.45).strokeColor(GREEN);

      // ================= HEADER =================
      centerText("AIRRUSH CHARTERS LTD", 12, 13, true, GREEN);
      centerText("INTERNATIONAL AIR CARGO AIR WAYBILL", 28, 7.5, true);

      let y = 42;

      doc.rect(left, y, width, 735).stroke(GREEN);

      doc.font("Helvetica-Bold").fontSize(8).fillColor("black");
      doc.text(safe(cargo.airwaybill, ""), left + 4, y + 5);
      doc.text(safe(cargo.airwaybill, ""), left + width - 90, y + 5, {
        width: 85,
        align: "right",
      });

      y += 18;

      // ================= SHIPPER =================
      box(
        left,
        y,
        245,
        65,
        "Shipper's Name and Address",
        `${safe(shipper.name, cargo.customerName || "")}
${safe(shipper.address, `${cargo.origin?.city || ""}, ${cargo.origin?.country || ""}`)}
Email: ${safe(cargo.customerEmail, "")}`,
        { valueSize: 6.3 }
      );

      box(
        left + 245,
        y,
        80,
        65,
        "Shipper's Account Number",
        safe(shipper.accountNumber, ""),
        { valueSize: 6.5 }
      );

      box(
        left + 325,
        y,
        width - 325,
        65,
        "Not Negotiable Air Waybill / Issued By",
        `${safe(awb.issuedBy, "AIRRUSH CHARTERS LTD")}
AWB No: ${safe(cargo.airwaybill, "")}`,
        { valueSize: 7, valueY: 18 }
      );

      y += 65;

      // ================= CONSIGNEE =================
      box(
        left,
        y,
        245,
        65,
        "Consignee's Name and Address",
        `${safe(consignee.name, cargo.customerName || "")}
${safe(consignee.address, `${cargo.destination?.city || ""}, ${cargo.destination?.country || ""}`)}
Account: ${safe(consignee.accountNumber, "")}`,
        { valueSize: 6.3 }
      );

      box(
        left + 245,
        y,
        80,
        65,
        "Consignee's Account Number",
        safe(consignee.accountNumber, ""),
        { valueSize: 6.5 }
      );

      box(
        left + 325,
        y,
        width - 325,
        65,
        "Notice",
        "Copies 1, 2 and 3 of this Air Waybill are originals and have the same validity. Goods are accepted subject to the conditions of contract.",
        { valueSize: 5.4, valueY: 15 }
      );

      y += 65;

      // ================= AGENT =================
      box(
        left,
        y,
        310,
        35,
        "Issuing Carrier's Agent Name and City",
        safe(awb.issuingCarrierAgent, "AIRRUSH CHARTERS")
      );

      box(
        left + 310,
        y,
        90,
        35,
        "Agent's IATA Code",
        safe(awb.agentIataCode, "")
      );

      box(
        left + 400,
        y,
        width - 400,
        35,
        "Account No.",
        safe(awb.accountNumber, "")
      );

      y += 35;

      // ================= AIRPORT OF DEPARTURE =================
      box(
        left,
        y,
        width,
        35,
        "Airport of Departure / Requested Routing",
        safe(
          awb.airportOfDeparture ||
            flight.departureAirport ||
            `${cargo.origin?.city || ""}, ${cargo.origin?.country || ""}`,
          ""
        )
      );

      y += 35;

      // ================= ROUTING =================
      box(left, y, 55, 34, "To", safe(cargo.destination?.city, ""));
      box(left + 55, y, 80, 34, "By First Carrier", safe(flight.airline, ""));
      box(left + 135, y, 65, 34, "Routing", safe(awb.routingTo, ""));
      box(left + 200, y, 45, 34, "By", safe(awb.routingBy, ""));
      box(left + 245, y, 50, 34, "Currency", safe(awb.currency, "USD"));
      box(left + 295, y, 55, 34, "CHGS", "");
      box(left + 350, y, 55, 34, "WT/VAL", "");
      box(left + 405, y, 55, 34, "Other", "");
      box(left + 460, y, 80, 34, "Declared Value Carriage", safe(awb.declaredValueCarriage, "NVD"));
      box(left + 540, y, width - 540, 34, "Declared Value Customs", safe(awb.declaredValueCustoms, "NCV"));

      y += 34;

      // ================= DESTINATION / FLIGHT =================
      box(
        left,
        y,
        310,
        35,
        "Airport of Destination",
        safe(
          awb.airportOfDestination ||
            flight.destinationAirport ||
            `${cargo.destination?.city || ""}, ${cargo.destination?.country || ""}`,
          ""
        )
      );

      box(
        left + 310,
        y,
        110,
        35,
        "Requested Flight / Date",
        `${safe(flight.flightNumber, "")}
${formatDate(cargo.departureDate || flight.departureTime)}`
      );

      box(
        left + 420,
        y,
        100,
        35,
        "Amount of Insurance",
        safe(awb.insuranceAmount, "")
      );

      box(
        left + 520,
        y,
        width - 520,
        35,
        "Insurance Notice",
        "If insurance is requested, state amount to be insured.",
        { titleSize: 5 }
      );

      y += 35;

      // ================= HANDLING =================
      box(
        left,
        y,
        width,
        38,
        "Handling Information",
        safe(awb.handlingInformation || cargo.delayReason, "")
      );

      y += 38;

      // ================= GOODS TABLE =================
      const goodsY = y;
      const headH = 28;
      const bodyH = 105;

      const cols = [
        [left, 45, "No. Pieces"],
        [left + 45, 62, "Gross Weight"],
        [left + 107, 30, "Kg"],
        [left + 137, 55, "Rate Class"],
        [left + 192, 75, "Commodity Item No."],
        [left + 267, 78, "Chargeable Weight"],
        [left + 345, 55, "Rate"],
        [left + 400, 65, "Total"],
        [left + 465, width - 465, "Nature and Quantity of Goods"],
      ];

      cols.forEach(([x, w, title]) =>
        box(x, goodsY, w, headH, title, "", {
          fill: LIGHT_GREEN,
          titleSize: 5,
        })
      );

      const goodsDescription = `${safe(d.natureOfGoods || d.description, "GENERAL CARGO")}
Description: ${safe(d.description, "")}
Pieces: ${safe(d.pieces || d.quantity, "")}
Dimensions: ${safe(d.length, 0)} × ${safe(d.width, 0)} × ${safe(d.height, 0)} cm
Volume: ${safe(d.volume, 0)} cm³`;

      const values = [
        safe(d.pieces || d.quantity, ""),
        safe(d.weight, ""),
        "K",
        safe(c.rateClass, ""),
        safe(d.commodityItemNumber, ""),
        safe(c.chargeableWeight || d.weight, ""),
        safe(c.rate, ""),
        safe(c.weightCharge || cargo.price, ""),
        goodsDescription,
      ];

      cols.forEach(([x, w], i) =>
        box(x, goodsY + headH, w, bodyH, "", values[i], {
          valueSize: i === 8 ? 5.7 : 6.5,
          valueY: 5,
        })
      );

      y += headH + bodyH;

      // ================= CHARGES =================
      box(left, y, 115, 32, "Prepaid", safe(c.totalPrepaid, ""));
      box(left + 115, y, 115, 32, "Collect", safe(c.totalCollect, ""));
      box(left + 230, y, 115, 32, "Weight Charge", safe(c.weightCharge || cargo.price, ""));
      box(left + 345, y, 115, 32, "Valuation Charge", safe(c.valuationCharge, ""));
      box(left + 460, y, width - 460, 32, "Tax", safe(c.tax, ""));

      y += 32;

      box(left, y, 170, 34, "Total Other Charges Due Agent", safe(c.totalOtherChargesDueAgent, ""));
      box(left + 170, y, 170, 34, "Total Other Charges Due Carrier", safe(c.totalOtherChargesDueCarrier, ""));
      box(left + 340, y, 120, 34, "Total Prepaid", safe(c.totalPrepaid, ""));
      box(left + 460, y, width - 460, 34, "Total Collect", safe(c.totalCollect, ""));

      y += 34;

      // ================= CERTIFICATION =================
      box(
        left,
        y,
        360,
        55,
        "",
        "Shipper certifies that the particulars on the face hereof are correct and that the shipment is properly described and in proper condition for carriage by air according to applicable regulations.",
        { valueSize: 5.6, valueY: 4 }
      );

      box(
        left + 360,
        y,
        width - 360,
        55,
        "Accounting Information",
        safe(awb.accountingInformation, "")
      );

      y += 55;

      // ================= SIGNATURES =================
      box(
        left,
        y,
        210,
        42,
        "Signature of Shipper or Agent",
        safe(awb.shipperSignature || shipper.name || cargo.customerName, "")
      );

      box(
        left + 210,
        y,
        120,
        42,
        "Executed on Date",
        formatDate(awb.executedOnDate || cargo.createdAt)
      );

      box(
        left + 330,
        y,
        110,
        42,
        "At Place",
        safe(awb.executedAtPlace || cargo.origin?.city, "")
      );

      box(
        left + 440,
        y,
        width - 440,
        42,
        "Signature of Carrier / Agent",
        safe(awb.carrierSignature, "AIRRUSH CHARTERS LTD")
      );

      // ================= FOOTER =================
      const footerY = 795;

      doc.moveTo(left, footerY).lineTo(left + width, footerY).stroke(GREEN);

      doc.font("Helvetica-Bold").fontSize(8).fillColor("red");
      doc.text("Original 1 (For Issuing Carrier)", left, footerY + 6, {
        width,
        align: "center",
      });

      doc.font("Helvetica").fontSize(7).fillColor("black");
      doc.text(
        "Airrush Charters Ltd | Cargo Operations Department | International Air Cargo Services",
        left,
        footerY + 20,
        {
          width,
          align: "center",
        }
      );

      doc.font("Helvetica-Bold").fontSize(8);
      doc.text(safe(cargo.airwaybill, ""), left, footerY + 20);
      doc.text(safe(cargo.airwaybill, ""), left + width - 90, footerY + 20, {
        width: 90,
        align: "right",
      });

      doc.end();
    } catch (err) {
      console.error("PDF generation failed:", err);
      reject(err);
    }
  });
};