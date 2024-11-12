import mongoose from 'mongoose';

const mySchema = new mongoose.Schema({
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    user:{
        type: mongoose.Types.ObjectId , 
        ref:"User"
    },
});

const EmployeeLeave = mongoose.model('EmployeeLeave', mySchema);

export default EmployeeLeave;
