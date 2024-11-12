import mongoose from "mongoose";

const mySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Description: {
      type: String,
    },
    Employee: {
      type: String,
    },
    Status:{
        type:String , 
        default:"Ongoing" , 
    }, 
    DueDate:{
        type:String,
    },
    Members:[{
        type: mongoose.Schema.Types.ObjectId , 
          ref:"User"
    }] , 
  
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", mySchema);

export default Projects;
