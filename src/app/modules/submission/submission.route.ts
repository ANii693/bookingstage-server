
import express from "express";
import { clientSubmissionInfo, clientSubmissionInfoForOne, EventSubmissionFunc } from "./submission.controller";
import multer from "multer";

const SubmissionRoute = express.Router();
// // all Routes
// PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);
const upload = multer({ dest: "uploads/" }); 

SubmissionRoute.post("/event",upload.array('files[0]'), EventSubmissionFunc);
SubmissionRoute.get("/list", clientSubmissionInfo);
SubmissionRoute.get("/list/:id", clientSubmissionInfoForOne);
// SubmissionRoute.post("/order/validate", PaymentValidation);

export default SubmissionRoute;