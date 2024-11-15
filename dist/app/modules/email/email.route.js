"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const email_controller_1 = require("./email.controller");
const upload_1 = __importDefault(require("../../../middleware/upload")); // Assuming you have a middleware for file uploads
const emailRouter = express_1.default.Router();
emailRouter.post('/send-repair-request', upload_1.default.array('images', 5), email_controller_1.sendRepairRequest);
emailRouter.post('/send-donation-request', upload_1.default.array('images', 5), email_controller_1.sendDonationRequest);
emailRouter.post('/send-customization-request', upload_1.default.array('images', 5), email_controller_1.sendCustomizationRequest);
exports.default = emailRouter;
