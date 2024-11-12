import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
    branch: {
        type: String,
    },
    user: {
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    Employee: {
        type:String
    },
    Department: {
        type: String,
    },
    TransferDate: {
        type: String,
    } , 
    Description:{
        type:String,
    }
});

const Transfer = mongoose.model('Transfer', transferSchema);

export default Transfer;
