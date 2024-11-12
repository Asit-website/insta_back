import mongoose from "mongoose";


const mySchema = new mongoose.Schema({
  content:{
    type:String,
  } , 
  user: {
    type:mongoose.Types.ObjectId,
    ref:"User"
},
  
  },{timestamps:true});

  const ExperienceLetter = mongoose.model("ExperienceLetter", mySchema);

  export default ExperienceLetter;