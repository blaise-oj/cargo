import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const generateReceiptPDF = async (cargo) => {
  const templatePath = path.join(__dirname, "../assets/airwaybill.pdf");
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { height } = page.getSize();

  // Use top-left coordinates like CSS
  const draw = (text, x, top, size = 7, width = 120, isBold = false) => {
    page.drawText(String(text || ""), {
      x,
      y: height - top,
      size,
      font: isBold ? bold : font,
      maxWidth: width,
      lineHeight: size + 2,
      color: rgb(0, 0, 0),
    });
  };

  const d = cargo.cargoDetails || {};
  const c = cargo.charges || {};
  const shipper = cargo.shipper || {};
  const consignee = cargo.consignee || {};
  const flight = cargo.flightDetails || {};
  const awb = cargo.awbDetails || {};

  // =========================
  // AWB NUMBERS
  // =========================
  // Top Left
draw(cargo.airwaybill,75,14,8,90, true);

// Top Right
draw(cargo.airwaybill, 420, 70, 8, 90, true);

// Bottom Left
draw(cargo.airwaybill,60,725, 8, 90, true);

// Bottom Right
draw(cargo.airwaybill, 470, 705, 8, 90, true);


  // =========================
  // SHIPPER
  // =========================
  draw(shipper.name || cargo.customerName, 85, 58, 7, 145);
  draw(shipper.address, 85,69, 6.5, 145);
  draw(shipper.accountNumber, 260, 40, 6.5, 90);

  // =========================
  // CONSIGNEE
  // =========================
  draw(consignee.name, 85, 105, 7, 145);
  draw(consignee.address, 85, 124, 6.5, 145);
  draw(consignee.accountNumber, 260, 105, 6.5, 90);

  // =========================
  // AGENT / ACCOUNTING
  // =========================
  draw(awb.issuingCarrierAgent || "AIRRUSH CHARTERS", 75, 175, 6.5, 170);
  draw(awb.agentIataCode, 75, 175, 6.5,170);
  draw(awb.accountNumber, 75, 175, 6.5, 170);
  draw(awb.accountingInformation,225, 220,6.5,170);

  // =========================
  // AIRPORT / ROUTING
  // =========================
  draw(
    flight.departureAirport || `${cargo.origin?.city || ""}, ${cargo.origin?.country || ""}`,
    75,
    240,
    6.5,
    220
  );

  draw(cargo.destination?.city || "", 75, 260, 6.5, 220);
  draw(flight.airline || "",115, 262, 6.5,220);
   draw(cargo.destination?.city || "",225, 260, 6.5, 220);
  draw(flight.destinationAirport || cargo.destination?.city || "", 75, 283, 6.5, 220);


  draw(
    `${flight.flightNumber || ""} ${formatDate(cargo.departureDate || flight.departureTime)}`,
   214, 286, 6.5, 220
  );

  draw(awb.insuranceAmount,175, 283, 6.5, 220);

  // =========================
  // HANDLING
  // =========================
  draw(awb.handlingInformation || cargo.delayReason || "",430, 375, 6.5, 120);

  // =========================
  // GOODS TABLE
  // =========================
  draw(d.pieces || d.quantity, 75, 375, 6.5,122);
  draw(d.weight,115, 375, 6.5,122);
  draw("KG",145, 375, 7, 20);
  draw(d.commodityItemNumber, 175, 395, 7, 2);
  draw(c.chargeableWeight || d.weight, 240, 405, 7, 45);
  draw(c.weightCharge || cargo.price, 365, 505, 7, 60);

  draw(
    `${d.natureOfGoods || d.description || "GENERAL CARGO"}
${d.quantity || ""} PCS
${d.length || 0} x ${d.width || 0} x ${d.height || 0} cm
Volume: ${d.volume || 0}`,
    430,
    485,
    6.5,
    130
  );

  // =========================
  // CHARGES
  // =========================


  // =========================
  // SIGNATURE / FOOTER
  // =========================
 
  draw(formatDate(cargo.createdAt), 270, 680, 6, 90);
  draw(cargo.origin?.city || "", 370, 680, 6, 80);
  draw("AIRRUSH CHARTERS LTD", 480, 670, 6, 100);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};