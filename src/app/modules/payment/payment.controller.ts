import { Request, Response } from "express";
require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
import { Order } from "../OrderProduct/orderSuccess.model";
import moment from "moment";
import { EventSubmission } from "../submission/submission.model"; // Import the new EventSubmission model

// Create Payment Intent function
export const CreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body.options;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error creating order");
    }

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing payment intent");
  }
};

// Payment Validation function
export const PaymentValidation = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  // Extract order details from the request body
  const { buyerEmail, name, Address, City, Postcode, EmailAddress, Phone, totalPrice, orderProducts } = req.body.user;

  const now = moment();
  // Create the order document in MongoDB
  const newOrder = new Order({
    buyerEmail,
    name,
    Address,
    City,
    Postcode,
    EmailAddress,
    Phone,
    totalPrice,
    orderStatusDate: new Date().toISOString(),
    shipmentStatus: "Success", // Initial status
    orderProducts,
    date: now.format("MM/DD/YY hh:mm a"),
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

  // Save the new order in MongoDB
  const savedOrder = await newOrder.save();

  // Iterate over the products and create submissions in EventSubmission
  for (const product of orderProducts) {
    // Check if event submission already exists for the eventUserId to prevent duplicates

    for (let i = 0; i < product.totalCard; i++) {
      const newEventSubmission = new EventSubmission({
        eventUserId: product._id, // Assuming product._id is the unique ID for the product
        userEmail: EmailAddress,
        eventimg:product.img,
        eventname: product.productName,
        videoPath: "", // Fill in as per your requirements
        certificatePath: "", // Fill in as per your requirements
        feedbackReportPath: "", // Fill in as per your requirements
      });

      // Save the event submission to MongoDB
      await newEventSubmission.save();
    }
  }
  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};
