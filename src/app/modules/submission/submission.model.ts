import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Importing the uuid package to generate unique IDs

// Define the TypeScript interface for your data model
interface EventSubmissionDataType extends Document {
  id: string; // Custom id field
  eventUserId: string;
  eventname: string
  eventimg: string
  userEmail: string;
  videoPath: string;
  videoUrl: string;
  videoThumbnail: string;
  certificatePath: string;
  feedbackReportPath: string;
}

// Define the Mongoose schema for EventSubmission
const EventSubmissionSchema = new Schema<EventSubmissionDataType>({
  id: {
    type: String,
    default: uuidv4, // Generate a new UUID by default
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
    required: false,  // https://www.youtube.com/watch?v=RieKWodQgVQ  after watch?v=    <videoid>
  },
  videoThumbnail: {
    type: String,
    required: false,  //  https://img.youtube.com/vi/RieKWodQgVQ/hqdefault.jpg   /vi/<videoid>/hqdefault.jpg
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
export const EventSubmission = model<EventSubmissionDataType>("EventSubmission", EventSubmissionSchema);
