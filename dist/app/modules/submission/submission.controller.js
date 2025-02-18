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
exports.clientSubmissionInfoForOne = exports.clientSubmissionInfo = exports.EventSubmissionFunc = void 0;
const crypto_1 = __importDefault(require("crypto")); // To encrypt file names
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const submission_model_1 = require("./submission.model");
// Function to generate unique encrypted file name
const generateUniqueFileName = (originalName) => {
    const extname = path_1.default.extname(originalName); // Get file extension
    const randomString = crypto_1.default.randomBytes(16).toString("hex"); // Generate random string
    return `${randomString}${extname}`; // Return encrypted file name with extension
};
const EventSubmissionFunc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);
        const eventId = req.body.eventId;
        const eventName = req.body.eventName;
        const files = req.files;
        // Validate request data
        if (!eventId || !eventName || !files || files.length === 0) {
            console.error("Invalid request: Missing eventId, eventName, or files");
            return res.status(400).json({ message: "Invalid request: eventId, eventName, or files missing" });
        }
        // Check if event with eventId exists in the database
        const eventSubmission = yield submission_model_1.EventSubmission.findOne({ id: eventId });
        if (!eventSubmission) {
            console.error(`Event with ID ${eventId} not found`);
            return res.status(404).json({ message: "Event not found" });
        }
        // Define the base directory for storing files
        const uploadBaseDir = path_1.default.join(__dirname, "..", "..", "..", "..", "uploads"); // Base directory for storing files
        const eventDir = path_1.default.join(uploadBaseDir, eventName); // Directory for the specific event
        // Check if directory exists; if not, create it
        if (!fs_1.default.existsSync(eventDir)) {
            console.log(`Directory not found. Creating directory: ${eventDir}`);
            fs_1.default.mkdirSync(eventDir, { recursive: true });
        }
        // Move and encrypt file names for each uploaded file
        for (const file of files) {
            const existingFilePath = path_1.default.join(eventDir, file.originalname);
            const destPath = fs_1.default.existsSync(existingFilePath) ? existingFilePath : path_1.default.join(eventDir, generateUniqueFileName(file.originalname));
            // If the file exists, remove the existing file
            if (fs_1.default.existsSync(existingFilePath)) {
                console.log(`Removing existing file: ${existingFilePath}`);
                fs_1.default.unlinkSync(existingFilePath);
            }
            fs_1.default.renameSync(file.path, destPath); // Move file to the new destination
            console.log(`File saved to: ${destPath}`);
            // Check if there was a previously uploaded video and delete it
            if (eventSubmission.videoPath) {
                const removeVideoPath = path_1.default.join(uploadBaseDir, eventSubmission.videoPath);
                if (fs_1.default.existsSync(removeVideoPath)) {
                    console.log(`Removing old video file: ${removeVideoPath}`);
                    fs_1.default.unlinkSync(removeVideoPath); // Remove old video
                }
            }
            // Update the video path in the database with the relative path
            try {
                // Store relative path in the database
                const relativePath = path_1.default.relative(uploadBaseDir, destPath).replace(/\\/g, "/"); // Get relative path
                eventSubmission.videoPath = relativePath; // Store relative path in the database
                // Save the updated event submission with the new video path
                yield eventSubmission.save();
                console.log("Database updated with video path:", relativePath);
            }
            catch (dbError) {
                console.error("Error updating database:", dbError);
                return res.status(500).json({ message: "Failed to update database with video path" });
            }
        }
        res.status(200).json({ message: "Files uploaded and database updated successfully" });
    }
    catch (error) {
        // Handle unknown error type safely
        if (error instanceof Error) {
            console.error("Error in EventSubmissionFunc:", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
        else {
            console.error("Unknown Error in EventSubmissionFunc:", error);
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.EventSubmissionFunc = EventSubmissionFunc;
const clientSubmissionInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const products = yield submission_model_1.EventSubmission.find({ userEmail: email }).sort({ date: -1 });
        res.status(200).send({ message: "success", data: products });
    }
    catch (e) {
        console.error("Error fetching client submissions:", e);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.clientSubmissionInfo = clientSubmissionInfo;
const clientSubmissionInfoForOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield submission_model_1.EventSubmission.find({ eventUserId: req.params.id });
        res.status(200).send({
            data: product,
        });
    }
    catch (e) {
        console.error("Error fetching client submission for one:", e);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.clientSubmissionInfoForOne = clientSubmissionInfoForOne;
