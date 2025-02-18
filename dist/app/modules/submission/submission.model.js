"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubmission = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid"); // Importing the uuid package to generate unique IDs
// Define the Mongoose schema for EventSubmission
const EventSubmissionSchema = new mongoose_1.Schema({
    id: {
        type: String,
        default: uuid_1.v4,
        unique: true, // Ensure that the id is unique
    },
    eventUserId: {
        type: String,
        required: true,
        index: true, // Optional: Ensure the eventUserId is indexed
    },
    eventimg: {
        type: String,
        required: true,
    },
    eventname: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    videoPath: {
        type: String,
        required: false,
    },
    videoUrl: {
        type: String,
        required: false, // https://www.youtube.com/watch?v=RieKWodQgVQ  after watch?v=    <videoid>
    },
    videoThumbnail: {
        type: String,
        required: false, //  https://img.youtube.com/vi/RieKWodQgVQ/hqdefault.jpg   /vi/<videoid>/hqdefault.jpg
    },
    certificatePath: {
        type: String,
        required: false,
    },
    feedbackReportPath: {
        type: String,
        required: false,
    },
});
// Export the model
exports.EventSubmission = (0, mongoose_1.model)("EventSubmission", EventSubmissionSchema);
