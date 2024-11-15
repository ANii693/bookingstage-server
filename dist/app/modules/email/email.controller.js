"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomizationRequest = exports.sendDonationRequest = exports.sendRepairRequest = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendEmail = (to, subject, html, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: '"Fresh Toys" <noreply@freshtoys.com>',
            to,
            subject,
            html,
            attachments
        });
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
});
const sendRepairRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, body, to } = req.body;
    const files = req.files;
    const html = `
    <h2>New Repair Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Description:</strong> ${body}</p>
  `;
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: file.path
    }));
    const emailSent = yield sendEmail(to, 'New Repair Request', html, attachments);
    if (emailSent) {
        res.status(200).json({ success: true, message: 'Repair request sent successfully' });
    }
    else {
        res.status(500).json({ success: false, message: 'Failed to send repair request' });
    }
});
exports.sendRepairRequest = sendRepairRequest;
const sendDonationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, numberOfToys, donationDetails, to } = req.body;
    const files = req.files;
    const html = `
    <h2>New Donation Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Number of Toys:</strong> ${numberOfToys}</p>
    <p><strong>Donation Details:</strong> ${donationDetails}</p>
  `;
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: file.path
    }));
    const emailSent = yield sendEmail(to, 'New Donation Request', html, attachments);
    if (emailSent) {
        res.status(200).json({ success: true, message: 'Donation request sent successfully' });
    }
    else {
        res.status(500).json({ success: false, message: 'Failed to send donation request' });
    }
});
exports.sendDonationRequest = sendDonationRequest;
const sendCustomizationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, customizationDetails, to } = req.body;
    const files = req.files;
    const html = `
    <h2>New Customization Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Customization Details:</strong> ${customizationDetails}</p>
  `;
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: file.path
    }));
    const emailSent = yield sendEmail(to, 'New Customization Request', html, attachments);
    if (emailSent) {
        res.status(200).json({ success: true, message: 'Customization request sent successfully' });
    }
    else {
        res.status(500).json({ success: false, message: 'Failed to send customization request' });
    }
});
exports.sendCustomizationRequest = sendCustomizationRequest;
