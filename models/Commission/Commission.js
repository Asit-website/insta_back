import mongoose from 'mongoose';
const mySchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
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

const Commission = mongoose.model('Commission', mySchema);

export default Commission;
