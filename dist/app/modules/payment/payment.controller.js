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
exports.PaymentValidation = exports.CreatePaymentIntent = void 0;
require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const orderSuccess_model_1 = require("../OrderProduct/orderSuccess.model");
const moment_1 = __importDefault(require("moment"));
const submission_model_1 = require("../submission/submission.model"); // Import the new EventSubmission model
// Create Payment Intent function
const CreatePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = req.body.options;
        const order = yield razorpay.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating order");
        }
        res.json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error processing payment intent");
    }
});
exports.CreatePaymentIntent = CreatePaymentIntent;
// Payment Validation function
const PaymentValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Transaction is not legit!" });
    }
    // Extract order details from the request body
    const { buyerEmail, name, Address, City, Postcode, EmailAddress, Phone, totalPrice, orderProducts } = req.body.user;
    const now = (0, moment_1.default)();
    // Create the order document in MongoDB
    const newOrder = new orderSuccess_model_1.Order({
        buyerEmail,
        name,
        Address,
        City,
        Postcode,
        EmailAddress,
        Phone,
        totalPrice,
        orderStatusDate: new Date().toISOString(),
        shipmentStatus: "Success",
        orderProducts,
        date: now.format("MM/DD/YY hh:mm a"),
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
    });
    // Save the new order in MongoDB
    const savedOrder = yield newOrder.save();
    // Iterate over the products and create submissions in EventSubmission
    for (const product of orderProducts) {
        // Check if event submission already exists for the eventUserId to prevent duplicates
        for (let i = 0; i < product.totalCard; i++) {
            const newEventSubmission = new submission_model_1.EventSubmission({
                eventUserId: product._id,
                userEmail: EmailAddress,
                eventimg: product.img,
                eventname: product.productName,
                videoPath: "",
                certificatePath: "",
                feedbackReportPath: "", // Fill in as per your requirements
            });
            // Save the event submission to MongoDB
            yield newEventSubmission.save();
        }
    }
    res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
});
exports.PaymentValidation = PaymentValidation;
