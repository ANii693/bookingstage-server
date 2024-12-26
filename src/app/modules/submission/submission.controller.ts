import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { EventSubmission } from "./submission.model"; 
import crypto from "crypto"; // To encrypt file names

// Function to generate unique encrypted file name
const generateUniqueFileName = (originalName: string): string => {
  const extname = path.extname(originalName); // Get file extension
  const randomString = crypto.randomBytes(16).toString("hex"); // Generate random string
  return `${randomString}${extname}`; // Return encrypted file name with extension
};

export const EventSubmissionFunc = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const eventId = req.body.eventId;
    const eventName = req.body.eventName;
    const files = req.files as Express.Multer.File[];

    // Validate request data
    if (!eventId || !eventName || !files || files.length === 0) {
      console.error("Invalid request: Missing eventId, eventName, or files");
      return res.status(400).json({ message: "Invalid request: eventId, eventName, or files missing" });
    }

    // Check if event with eventId exists in the database
    const eventSubmission = await EventSubmission.findOne({ id:eventId });

    if (!eventSubmission) {
      console.error(`Event with ID ${eventId} not found`);
      return res.status(404).json({ message: "Event not found" });
    }

    // Define the base directory for storing files
    const uploadBaseDir = path.join(__dirname, "..","..", "..", "..", "uploads"); // Base directory for storing videos
    const eventDir = path.join(uploadBaseDir, eventName); // Directory for the specific event

    // Check if directory exists; if not, create it
    if (!fs.existsSync(eventDir)) {
      console.log(`Directory not found. Creating directory: ${eventDir}`);
      fs.mkdirSync(eventDir, { recursive: true });
    }

    // Move and encrypt file names for each uploaded file
    files.forEach(async (file) => {
      const encryptedFileName = generateUniqueFileName(file.originalname); // Get encrypted file name
      const destPath = path.join(eventDir, encryptedFileName); // Final file path
      fs.renameSync(file.path, destPath); // Move file to the new destination

      console.log(`File saved to: ${destPath}`);

      // Update the video path in the database with the relative path
      try {
        // Store relative path in the database
        const relativePath = path.relative(uploadBaseDir, destPath).replace(/\\/g, "/"); // Get relative path
        eventSubmission.videoPath = relativePath; // Store relative path in the database

        // Save the updated event submission with the new video path
        await eventSubmission.save();
        console.log("Database updated with video path:", relativePath);
      } catch (dbError) {
        console.error("Error updating database:", dbError);
        return res.status(500).json({ message: "Failed to update database with video path" });
      }
    });

    res.status(200).json({ message: "Files uploaded and database updated successfully" });
  } catch (error) {
    // Handle unknown error type safely
    if (error instanceof Error) {
      console.error("Error in EventSubmissionFunc:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      console.error("Unknown Error in EventSubmissionFunc:", error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
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