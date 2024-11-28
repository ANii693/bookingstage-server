import { Request, Response } from "express";
require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
// const stripe = require("stripe")(process.env.STRIPE_KEY);

// export const CreatePaymentIntent = async (req: Request, res: Response) => {
//   try {
//     const { totalPrice } = req.body;
//     const amount = totalPrice * 100; 

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error:any) {
//     console.error("Error creating PaymentIntent:", error.message);
//     res.status(500).json({ error: "Failed to create PaymentIntent." });
//   }
// };
export const CreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
}
export const PaymentValidation = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;

const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//order_id + "|" + razorpay_payment_id
sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
const digest = sha.digest("hex");
if (digest !== razorpay_signature) {
  return res.status(400).json({ msg: "Transaction is not legit!" });
}

res.json({
  msg: "success",
  orderId: razorpay_order_id,
  paymentId: razorpay_payment_id,
});
}