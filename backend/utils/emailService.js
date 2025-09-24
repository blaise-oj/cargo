// utils/emailService.js
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// ✅ Shared transporter (Gmail SMTP)
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---------------------------------------------------------
// 🔧 Helpers
// ---------------------------------------------------------
const formatDate = (date) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleString("en-US", {
    timeZone: "Africa/Nairobi",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const wrapTemplate = (title, body, footerName) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
              padding:20px;border:1px solid #ddd;border-radius:8px;background:#f9f9f9;">
    <h2 style="color:#1d3557;">${title}</h2>
    ${body}
    <hr style="margin:20px 0;">
    <p style="font-size:12px;color:#555;">
      This is an automated message from <strong>${footerName}</strong>. Please do not reply.
    </p>
  </div>
`;

// ---------------------------------------------------------
// ✈️ Passenger Emails
// ---------------------------------------------------------
export const sendStatusEmail = async (passenger) => {
  const { customerName, customerEmail, airwaybill, destination, status } = passenger;

  let subject, htmlBody;

  switch (status) {
    case "Booked":
      subject = "Flight Booking Confirmed ✈️";
      htmlBody = `
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Your flight booking <b>${airwaybill}</b> has been confirmed.</p>
        <p>We look forward to flying with you!</p>
      `;
      break;

    case "Checked In":
      subject = "Check-In Complete ✅";
      htmlBody = `
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>You are now checked in for booking <b>${airwaybill}</b>.</p>
      `;
      break;

    case "In Transit":
      subject = "Flight In Transit 🛫";
      htmlBody = `
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Your flight <b>${airwaybill}</b> is currently in transit.</p>
      `;
      break;

    case "Arrived":
      subject = "Flight Arrived 🛬";
      htmlBody = `
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Your flight <b>${airwaybill}</b> has arrived at 
        <strong>${destination?.city || "your destination"}</strong>.</p>
      `;
      break;

    case "Cancelled":
      subject = "Flight Cancelled ❌";
      htmlBody = `
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Unfortunately, your booking <b>${airwaybill}</b> has been cancelled.</p>
      `;
      break;

    default:
      return;
  }

  await transporter.sendMail({
    from: `"Passenger Charters" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject,
    html: wrapTemplate(subject, htmlBody, "Passenger Charters"),
  });
};

// ---------------------------------------------------------
// 📦 Cargo Emails (dynamic + details)
// ---------------------------------------------------------
export const sendCargoStatusEmail = async (cargo) => {
  const {
    airwaybill,
    customerName,
    customerEmail,
    status,
    origin,
    destination,
    currentLocation,
    departureDate,
    arrivalDate,
    price,
  } = cargo;

  const subject = `Cargo Update: ${status} (Airwaybill ${airwaybill})`;

  const statusMessage =
    status === "Booked"
      ? "Your cargo is booked and awaiting departure."
      : status === "In Transit"
      ? "Your cargo is on the way."
      : status === "Arrived"
      ? "Your cargo has arrived at the destination. Please arrange for collection."
      : status === "Withdrawn"
      ? "Your cargo has been collected successfully."
      : "Your cargo status has been updated.";

  const htmlBody = `
    <p>Hello <strong>${customerName}</strong>,</p>
    <p>Your cargo with airwaybill <b>${airwaybill}</b> has been updated.</p>

    <h3>Status: ${status}</h3>
    <p><b>Current Location:</b> ${currentLocation?.city || "-"}, ${currentLocation?.country || "-"}</p>

    <h4>Shipment Details</h4>
    <ul>
      <li><b>Origin:</b> ${origin?.city}, ${origin?.country}</li>
      <li><b>Destination:</b> ${destination?.city}, ${destination?.country}</li>
      <li><b>Departure Date:</b> ${formatDate(departureDate)}</li>
      <li><b>Expected Arrival:</b> ${formatDate(arrivalDate)}</li>
      <li><b>Price:</b> $${price || "N/A"}</li>
    </ul>

    <p><b>What’s next?</b></p>
    <p>${statusMessage}</p>
  `;

  await transporter.sendMail({
    from: `"Cargo Charters" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject,
    html: wrapTemplate("Cargo Shipment Update", htmlBody, "Cargo Charters"),
  });
};
