import multer from "multer";
import { Request, Response } from "express";
import { EventSubmission } from "./submission.model"; 
// Configure the destination folder

export const EventSubmissionFunc = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // Parsed form data
    console.log(req.files); // Uploaded files


    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

export const clientSubmissionInfo = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const products = await EventSubmission.find({ userEmail: email }).sort({ date: -1 });
    res.status(200).send({ message: "success", data: products });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const clientSubmissionInfoForOne = async (req: Request, res: Response) => {
  try {
      const product = await EventSubmission.find({ eventUserId: req.params.id });

  

      res.status(200).send({
        data: product,

      });
    } catch (e) {
      res.send({ message: "custom error" });
    }
};