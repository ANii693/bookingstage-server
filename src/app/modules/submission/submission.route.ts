
import express from "express";
import { EventSubmission } from "./submission.controller";
import multer from "multer";

const SubmissionRoute = express.Router();
// // all Routes
// PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);
const upload = multer({ dest: "uploads/" }); 

SubmissionRoute.post("/event",upload.array('files[0]'), EventSubmission);

// SubmissionRoute.post("/order/validate", PaymentValidation);

export default SubmissionRoute;