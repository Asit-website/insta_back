import mongoose from 'mongoose';

const mySchema = new mongoose.Schema({
    name:String
});

const LeadType = mongoose.model('LeadType', mySchema);

export default LeadType;
