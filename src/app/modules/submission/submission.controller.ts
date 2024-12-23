import multer from "multer";
import { Request, Response } from "express";

// Configure the destination folder

export const EventSubmission = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // Parsed form data
    console.log(req.files); // Uploaded files
    console.log(req.headers); 

    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

