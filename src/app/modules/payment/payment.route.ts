// import verifyToken from '../../../middleware/userVerify';
import { CreatePaymentIntent, PaymentValidation } from './payment.controller';
import express from "express";
const crypto = require("crypto");
const Razorpay = require("razorpay");

const PaymentRoute = express.Router();
// // all Routes
// PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);


PaymentRoute.post("/order", CreatePaymentIntent);

PaymentRoute.post("/order/validate", PaymentValidation);

export default PaymentRoute;