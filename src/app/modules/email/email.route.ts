import express from 'express';
import { sendRepairRequest, sendDonationRequest, sendCustomizationRequest } from './email.controller';
import upload from '../../../middleware/upload'; // Assuming you have a middleware for file uploads

const emailRouter = express.Router();

emailRouter.post('/send-repair-request', upload.array('images', 5), sendRepairRequest);
emailRouter.post('/send-donation-request', upload.array('images', 5), sendDonationRequest);
emailRouter.post('/send-customization-request', upload.array('images', 5), sendCustomizationRequest);

export default emailRouter;