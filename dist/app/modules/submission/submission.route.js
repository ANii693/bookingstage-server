"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submission_controller_1 = require("./submission.controller");
const multer_1 = __importDefault(require("multer"));
const SubmissionRoute = express_1.default.Router();
// // all Routes
// PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);
const upload = (0, multer_1.default)({ dest: "uploads/" });
SubmissionRoute.post("/event", upload.array('files[0]'), submission_controller_1.EventSubmissionFunc);
SubmissionRoute.get("/list", submission_controller_1.clientSubmissionInfo);
SubmissionRoute.get("/list/:id", submission_controller_1.clientSubmissionInfoForOne);
// SubmissionRoute.post("/order/validate", PaymentValidation);
exports.default = SubmissionRoute;
