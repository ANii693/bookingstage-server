import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { RepairRequest, DonationRequest, CustomizationRequest } from './email.interface';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to: string, subject: string, html: string, attachments: any[]) => {
  try {
    await transporter.sendMail({
      from: '"Fresh Toys" <noreply@freshtoys.com>',
      to,
      subject,
      html,
      attachments
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendRepairRequest = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, body, to } = req.body as RepairRequest;
  const files = req.files as Express.Multer.File[];

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

  const emailSent = await sendEmail(to, 'New Repair Request', html, attachments);

  if (emailSent) {
    res.status(200).json({ success: true, message: 'Repair request sent successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send repair request' });
  }
};

export const sendDonationRequest = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, numberOfToys, donationDetails, to } = req.body as DonationRequest;
  const files = req.files as Express.Multer.File[];

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

  const emailSent = await sendEmail(to, 'New Donation Request', html, attachments);

  if (emailSent) {
    res.status(200).json({ success: true, message: 'Donation request sent successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send donation request' });
  }
};

export const sendCustomizationRequest = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, customizationDetails, to } = req.body as CustomizationRequest;
  const files = req.files as Express.Multer.File[];

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

  const emailSent = await sendEmail(to, 'New Customization Request', html, attachments);

  if (emailSent) {
    res.status(200).json({ success: true, message: 'Customization request sent successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send customization request' });
  }
};