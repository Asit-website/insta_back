import mongoose from "mongoose";

const mySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Email: {
      type: String,
    },
    City: {
      type: String,
    },
    State:{
        type:String , 
    }, 
    ZipCode:{
        type:String,
    },
    PhoneNumber:{
        type:String , 
    } , 
    Country:{
        type:String , 
    } , 
    Address:{
        type:String ,
    } , 
    isDisable:{
      type:Boolean , 
       default:false 
    }
  },
  { timestamps: true }
);

const Clients = mongoose.model("Clients", mySchema);

export default Clients;
