import express from "express";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";


const dashboardRoute = express.Router();
// all Routes



export default dashboardRoute;
