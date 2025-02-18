"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import verifyToken from '../../../middleware/userVerify';
const payment_controller_1 = require("./payment.controller");
const express_1 = __importDefault(require("express"));
const crypto = require("crypto");
const Razorpay = require("razorpay");
const PaymentRoute = express_1.default.Router();
// // all Routes
// PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);
PaymentRoute.post("/order", payment_controller_1.CreatePaymentIntent);
PaymentRoute.post("/order/validate", payment_controller_1.PaymentValidation);
exports.default = PaymentRoute;
