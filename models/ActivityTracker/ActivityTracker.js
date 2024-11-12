import mongoose from "mongoose";

const mySchema = new mongoose.Schema({
  user: {
     type:mongoose.Types.ObjectId,
    ref:"User"
  },
  date: String, 
  date1: String, 
  clockIn: String,
  clockOut: String,
  late: String,
  overtime: String,
  total: String,
  message: String
});

const ActivityTracker = mongoose.model("ActivityTracker", mySchema);

export default ActivityTracker;
