// config/nodemailer.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Safety check for required env variables
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("❌ Missing SMTP credentials in .env file");
}

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false, // TLS via STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


