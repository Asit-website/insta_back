import mongoose from 'mongoose';

const clockSchema = new mongoose.Schema({
    Date: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    clockIn: {
        type: String,
    },
    clockOut: {
        type: String,
    } , 
    overTime:{
        type:String,
    },
    breakTime:{
        type:String,
    }, 
    Note:{
        type:String , 
        default:""
    },
    todayTask:{
        type:String  , 
        default:""
    }
});

const Clock = mongoose.model('Clock', clockSchema);

export default Clock;
