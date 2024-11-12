import mongoose from 'mongoose';

const paySlipSchema = new mongoose.Schema({
    user:[{
        type: mongoose.Types.ObjectId,
        ref: "User" 
    }] ,
    month: {
        type: String
    },
    year: {
        type: String,
    },
    status: {
        type: String,
        default:"Unpaid"
    },
});

const payslip = mongoose.model('Payslip', paySlipSchema);

export default payslip;
