import { model, Schema } from "mongoose";


interface SubmissionDataType {
    useremail: string | undefined;
    video: string | undefined;

}
const SubmissionSchema = new Schema<SubmissionDataType>({
    useremail: String,
    video: String,

});



export const Order = model<SubmissionDataType>("Order", SubmissionSchema);