import mongoose from "mongoose";

const mySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },

  from: String,
  to: String,
  days: String,
  reason: String,
  appliedOn:{
    type: Date ,
    default: Date.now()
  },
  status: {
    type: String,
    default: "Pending"
  },
  ts: {
    type: String,
    default: new Date().getTime()
  }
});

const Leave = mongoose.model("HalfDay", mySchema);

export default Leave;
