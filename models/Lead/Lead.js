import mongoose from "mongoose";

const mySchema = new mongoose.Schema({
    LeadOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    Company: String,
    FirstName: String,
    LastName: String,
    Title: String,
    Email: String,
    Phone: String,
    Fax: String,
    Mobile:  String,
    Website:  String,
    LeadSource:  String,
    NoOfEmployee:  String,
    Industry:  String,
    LeadStatus:  String,
    AnnualRevenue:  String,
    Rating:  String,
    EmailOptOut:  String,
    SkypeID:  String,
    SecondaryEmail:  String,
    Twitter:  String,
     Street:String ,
     City:String ,
     State:String ,
     ZipCode:String ,
     Country:String ,
     DescriptionInfo:String ,
     image:String , 
     date:{
      type: String, 
     } , 
     isOpen:{
      type: String , 
      default: "true" , 
     } ,
     createAt: {
      type: Date , 
      default:Date.now()
     },
     status:{
      type:String,
      default:"Open"
     },
     closeDate:{
      type:String,
     },
          invoiceId:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
      }
     ],
     quatationId:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quatation'
      }
     ]
  });

  const Lead = mongoose.model("Lead", mySchema);

  export default Lead;