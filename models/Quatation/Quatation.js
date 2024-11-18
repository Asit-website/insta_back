import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String },
  quantity: { type: String },
  price: { type: String },
  total: { type: String },
});

const mySchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    customerAddress: { type: String },
    customerCompany: { type: String },
    customerName: { type: String },
    quotationDate: { type: String },
    quotationNum: { type: String },
    rows: [
      {
        subject: { type: String, required: true }, 
        para: [
          {
            type: mongoose.Schema.Types.Mixed, 
          },
        ],
        items: [itemSchema], 
      },
    ],
  },
  { timestamps: true } 
);

const Quatation = mongoose.model("Quatation", mySchema);

export default Quatation;
