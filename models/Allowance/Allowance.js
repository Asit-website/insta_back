import mongoose from 'mongoose';
const mySchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    allowanceOption:{
        type:String
    },
    title:{
        type:String
    },
    type:{
        type:String
    },
    amount:{
        type:Number
    }
});

const Allowance = mongoose.model('Allowance', mySchema);

export default Allowance;
