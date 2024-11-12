import Lead from "../models/Lead/Lead.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import LeadStatus from "../models/Leadstatus/LeadStatus.js";
import LeadSource from "../models/LeadSource/LeadSource.js";
import User from "../models/User/User.js";
import Role from "../models/Role/Role.js";
import LeadNote from "../models/LeadNotes.js";
import Quatation from "../models/Quatation/Quatation.js";
import Proposal from "../models/Proposal/Proposal.js";
import OfferLetter from "../models/OfferLetter.js";
import LORLetter from "../models/LORLetter.js";
import Letter1 from "../models/Letter1.js";
import RelivingLetter from "../models/Reliving.js";
import ExperienceLetter from "../models/Experience.js";
import InternLetter from "../models/InternLetter.js";

export const createLead = async (req, res) => {
  try {
    const {
      LeadOwner,
      image,
      Company,
      FirstName,
      LastName,
      Title,
      Email,
      Phone,
      Fax,
      Mobile,
      Website,
      LeadSource,
      NoOfEmployee,
      Industry,
      LeadStatus,
      AnnualRevenue,
      Rating,
      EmailOptOut,
      SkypeID,
      SecondaryEmail,
      Twitter,
      Street,
      City,
      State,
      ZipCode,
      Country,
      DescriptionInfo,
      date
    } = req.body;

    const leadDetail = await Lead.create({
      LeadOwner: LeadOwner,
      Company: Company,
      FirstName,
      LastName,
      Title,
      Email,
      Phone,
      Fax,
      Mobile,
      Website,
      LeadSource,
      NoOfEmployee,
      Industry,
      LeadStatus,
      AnnualRevenue,
      Rating,
      EmailOptOut,
      SkypeID,
      SecondaryEmail,
      Twitter,
      Street,
      City,
      State,
      ZipCode,
      Country,
      DescriptionInfo,
      image,
      date
    });

    return res.status(200).json({
      status: true,
      message: "Successfuly created ",
      data: leadDetail,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error ",
    });
  }
};

export const OfferLetterDocs = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await OfferLetter.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const SaveRelivingLetter = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await RelivingLetter.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const saveExperienceLetter = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await ExperienceLetter.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const saveOfferLetterInter = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await InternLetter.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const saveLetter1Api = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await Letter1.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const saveLORLetter = async(req ,res)=>{
   try{

     const {userId , content} = req.body;

       const createletter = await LORLetter.create({user:userId , content});

        return res.status(200).json({
          status:200 , 
          data: createletter
        })
   } catch(error){
    console.log(error);
    return res.status(500).json({
      status:false , 
      message:"internal server error "
    })
   }
}

export const changeOfferLetterPer = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    user.offerLetterPermission = !user.offerLetterPermission;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Offer letter permission toggled successfully",
      offerLetterPermission: user.offerLetterPermission,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const changeExperienceLetterPer = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    user.ExperienceLetterPermission = !user.ExperienceLetterPermission;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Offer letter permission toggled successfully",
      ExperienceLetterPermission: user.ExperienceLetterPermission,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
export const changeRelivingLetterPer = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    user.RelievingLetterPermission = !user.RelievingLetterPermission;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Offer letter permission toggled successfully",
      RelievingLetterPermission: user.RelievingLetterPermission,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};



export const GetUserLetter = async( req ,res)=>{
  try{

    const {userId} = req.body;

    const createletter = await OfferLetter.find({user:userId});
     const relivingLetter = await RelivingLetter.find({user:userId});
     const expeletter = await ExperienceLetter.find({user:userId});
     const internLetter = await InternLetter.find({user:userId});

       return res.status(200).json({
         status:200 , 
         data:{
          relivingLetter ,
          createletter , expeletter , internLetter
         }
       })
  } catch(error){
   console.log(error);
   return res.status(500).json({
     status:false , 
     message:"internal server error "
   })
  }
}

export const PostQuotationForm = async (req, res) => {
  try {
    const {
      userId,
      leadId,
      quotationNum,
      customerName,
      customerReq,
      mobileNum,
      quotationDate,
      validUntil,
      customerId,
      companyName,
      companyAddress,
      companyGSTIN,
      companyWebsite,
      items,
      content,
    } = req.body;

    const newQuotation = new Quatation({
      userId,
      leadId,
      quotationNum,
      customerName,
      customerReq,
      mobileNum,
      quotationDate,
      validUntil,
      customerId,
      companyName,
      companyAddress,
      companyGSTIN,
      companyWebsite,
      items,
      content,
    });

    await newQuotation.save();

    res
      .status(201)
      .send({
        status: true,
        message: "Quotation saved successfully",
        newQuotation,
      });
  } catch (error) {
    console.log("error ", error);
    res.status(500).send({ message: "Error saving quotation", error });
  }
};

export const PostProposalForm = async (req, res) => {
  try {
    const {
      userId,
      leadId,
      proposalFor,
      preparedFor,
      createdBy,
      Date,
      content,
    } = req.body;

    const newQuotation = new Proposal({
      userId,
      leadId,
      proposalFor,
      preparedFor,
      createdBy,
      Date,
      content,
    });

    await newQuotation.save();

    res
      .status(201)
      .send({
        status: true,
        message: "Proposal saved successfully",
        newQuotation,
      });
  } catch (error) {
    console.log("error ", error);
    res.status(500).send({ message: "Error saving quotation", error });
  }
};

export const UpdateProposalForm = async (req, res) => {
    try {
      const {
          userId,
          proposalFor,
          preparedFor,
          createdBy,
          Date,
          content,
          leadId,
      } = req.body;
  
      const { quoId } = req.params;
  
      // Update the quotation
      const updatedQuotation = await Proposal.findByIdAndUpdate(
        quoId,
        {
          userId,
          leadId,
          proposalFor,
          preparedFor,
          createdBy,
          Date,
          content,
        },
        { new: true }
      );
  
      if (!updatedQuotation) {
        return res
          .status(404)
          .json({ status: false, message: "Quotation not found" });
      }
  
      res
        .status(200)
        .json({
          status: true,
          message: "Propsal updated successfully",
          data: updatedQuotation,
        });
    } catch (error) {
      console.error("Error updating quotation:", error);
      res
        .status(500)
        .json({ status: false, message: "Internal server error", error });
    }
  };

export const UpdateQuotationForm = async (req, res) => {
  try {
    const {
      userId,
      leadId,
      quotationNum,
      customerName,
      customerReq,
      mobileNum,
      quotationDate,
      validUntil,
      customerId,
      companyName,
      companyAddress,
      companyGSTIN,
      companyWebsite,
      items,
      content,
    } = req.body;

    const { quoId } = req.params;

    // Check if the ID is valid
    if (!quoId) {
      return res
        .status(400)
        .json({ status: false, message: "Quotation ID parameter is required" });
    }

    // Update the quotation
    const updatedQuotation = await Quatation.findByIdAndUpdate(
      quoId,
      {
        userId,
        leadId,
        quotationNum,
        customerName,
        customerReq,
        mobileNum,
        quotationDate,
        validUntil,
        customerId,
        companyName,
        companyAddress,
        companyGSTIN,
        companyWebsite,
        items,
        content,
      },
      { new: true }
    );

    if (!updatedQuotation) {
      return res
        .status(404)
        .json({ status: false, message: "Quotation not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Quotation updated successfully",
        data: updatedQuotation,
      });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};


export const DeleteQuotationapi = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is valid
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID parameter is required" });
    }

    // Attempt to delete the quotation
    const deletedQuotation = await Quatation.findByIdAndDelete(id);

    if (!deletedQuotation) {
      return res
        .status(404)
        .json({ status: false, message: "Quotation not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Quotation deleted successfully",
        data: deletedQuotation,
      });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};
export const deletePropapi = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is valid
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID parameter is required" });
    }

    // Attempt to delete the quotation
    const deletedQuotation = await Proposal.findByIdAndDelete(id);

    if (!deletedQuotation) {
      return res
        .status(404)
        .json({ status: false, message: "Quotation not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Quotation deleted successfully",
        data: deletedQuotation,
      });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

export const GetQuotationApi = async (req, res) => {
  const { leadId } = req.params;

  try {
    const quotations = await Quatation.find({ leadId });
    const proposals = await Proposal.find({leadId});

    res.status(200).json({
        quotations ,
         proposals
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};

export const GetOpenLeads = async (req, res) => {
  const { id } = req.params;

  const openLeads = await Lead.find({
    LeadOwner: id,
    isOpen: "true",
  }).populate("LeadOwner");

  const closeLead = await Lead.find({
    LeadOwner: id,
    isOpen: "false",
  }).populate("LeadOwner");

  return res.status(200).json({
    status: true,
    openLeads,
    closeLead,
  });
};

export const GetDesiUser = async (req, res) => {
  const users = await User.find({
    designation: {
      $in: [
        "Intern Digital Marketing",
        "Business Development Manager",
        "Manager",
        "Field Marketing Executive",
        "Business Development Executive"
      ],
    },
  });

  res.status(200).json({
    status: true,
    data: users,
  });
};

export const GetLeadByUser = async (req, res) => {
  const { id } = req.params;

  const allLead = await Lead.find({ LeadOwner: id });

  return res.status(200).json({
    status: true,
    data: allLead,
  });
};

export const CreateLeadStatus = async (req, res) => {
  const { status } = req.body;

  const ans = await LeadStatus.create({ name: status });

  return res.status(200).json({
    status: true,
    data: ans,
  });
};

export const getLeadStatus = async (req, res) => {
  const ans = await LeadStatus.find({});

  return res.status(200).json({
    status: true,
    data: ans,
  });
};
export const getLeadSource = async (req, res) => {
  const ans = await LeadSource.find({});

  return res.status(200).json({
    status: true,
    data: ans,
  });
};

export const CreateLeadSource = async (req, res) => {
  const { status } = req.body;

  const ans = await LeadSource.create({ name: status });

  return res.status(200).json({
    status: true,
    data: ans,
  });
};

export const UpdateLeadSource = async (req, res) => {
  const { status } = req.body;

  const ans = await LeadSource.findByIdAndUpdate(
    { name: status },
    { new: true }
  );

  return res.status(200).json({
    status: true,
    data: ans,
  });
};
export const UpdateLeadStatus = async (req, res) => {
  const { status } = req.body;

  const ans = await LeadStatus.findByIdAndUpdate(
    { name: status },
    { new: true }
  );

  return res.status(200).json({
    status: true,
    data: ans,
  });
};

export const GetLeadById = async (req, res) => {
  const { id } = req.params;

  const leadDetail = await Lead.findById(id).populate("LeadOwner");

  return res.status(200).json({
    status: true,
    data: leadDetail,
  });
};

export const getAllLead = async ({ id, query, page, perPage, userId }) => {
  let and = [];
  if (id && id !== "" && id !== "undefined") {
    and.push({ _id: id });
  }
  if (query && query !== "" && query !== "undefined") {
    and.push({ name: { $regex: query, $options: "i" } });
  }
  if (and.length === 0) {
    and.push({});
  }

  let data;
  if (page && page !== "" && page !== "undefined") {
    data = await User.find({ $and: and })
      .skip((page - 1) * perPage)
      .limit(perPage);
  } else {
    // data = await Lead.find({ $and: and }).populate("LeadOwner")
    data = await Lead.find({ LeadOwner: userId }).populate("LeadOwner");
  }
  return { status: true, data };
};

export const GetAllLeadByAdmin = async (req, res) => {
  const data = await Lead.find({});

  return res.status(200).json({
    status: true,
    message: "Succeesul",
    data,
  });
};

export const getAllLead2 = async ({ id, query, page, perPage }) => {
  let and = [];
  if (id && id !== "" && id !== "undefined") {
    and.push({ _id: id });
  }
  if (query && query !== "" && query !== "undefined") {
    console.log(query);
    and.push({ name: { $regex: query, $options: "i" } });
  }
  if (and.length === 0) {
    and.push({});
  }

  let data;
  if (page && page !== "" && page !== "undefined") {
    data = await User.find({ $and: and })
      .skip((page - 1) * perPage)
      .limit(perPage);
  } else {
    data = await Lead.find({ $and: and }).populate("LeadOwner");
  }
  return { status: true, data };
};

export const getAllLead3 = async ({ userId }) => {
  try {
    const allLead = await Lead.find({ LeadOwner: { $ne: userId } });
    return { status: true, allLead };
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const postImage = async (req, res) => {
  const { image } = req.files;

  const details = await uploadToCloudinary(image.tempFilePath);
  console.log("detail ", details);

  return res.status(200).json({
    status: true,
    data: details?.secure_url,
  });
};

export const deleteLeads = async (req, res) => {
  const { id } = req.params;

  const data = await Lead.findByIdAndDelete(id);

  return {
    data: data,
    status: true,
    message: "delete successfully",
  };
};

export const editLead = async (req, res) => {
  try {
    const {
      LeadOwner,
      image,
      Company,
      FirstName,
      LastName,
      Title,
      Email,
      Phone,
      Fax,
      Mobile,
      Website,
      LeadSource,
      NoOfEmployee,
      Industry,
      LeadStatus,
      AnnualRevenue,
      Rating,
      EmailOptOut,
      SkypeID,
      SecondaryEmail,
      Twitter,
      Street,
      City,
      State,
      ZipCode,
      Country,
      DescriptionInfo,
      date
    } = req.body;

    // Ensure id is passed as a parameter
    const id = req.params.id;

    // Update lead details
    const leadDetail = await Lead.findByIdAndUpdate(
      id,
      {
        LeadOwner,
        image,
        Company,
        FirstName,
        LastName,
        Title,
        Email,
        Phone,
        Fax,
        Mobile,
        Website,
        LeadSource,
        NoOfEmployee,
        Industry,
        LeadStatus,
        AnnualRevenue,
        Rating,
        EmailOptOut,
        SkypeID,
        SecondaryEmail,
        Twitter,
        Street,
        City,
        State,
        ZipCode,
        Country,
        DescriptionInfo,
        date
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Successfully updated",
      data: leadDetail,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // Sending specific error message to client
    });
  }
};

// ==============apis of lead things===============

export const leadByeveryUser = asyncHandler(async () => {
  const { name, email } = req.body;
  const leadBy = (await Lead.create({ name, email })).populate("firstName");

  return {
    status: true,
    message: "Lead by every user create successfully",
    data: leadBy,
    code: "404",
  };
});

export const leadEditByUser = asyncHandler(async () => {
  const { name, email } = req.body;

  console.log({ name, email });

  const leadBy = await Lead.findByIdAndUpdate({
    name: req.body.name,
    email: req.body.email,
  });
});

export const editLeadStatus = asyncHandler(async (req, res) => {
  try {
    const { LeadStatus } = req.body;

    const { id } = req.params;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { LeadStatus: LeadStatus },
      { new: true }
    );

    res.status(200).json({ message: "Lead status updated successfully", lead });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      status: false,
      message: "internal server error ",
    });
  }
});

export const editLeadNote = asyncHandler(async (req, res) => {
  try {
    const { Note, LeadStatus } = req.body;

    const { id } = req.params;

    let lead;

    if (LeadStatus == "Follow-up") {
      lead = await Lead.findByIdAndUpdate(
        id,
        { FollowNote: Note, NoteDate: Date.now() },
        { new: true }
      );
    } else if (LeadStatus == "Cold") {
      lead = await Lead.findByIdAndUpdate(
        id,
        { ColdNote: Note, NoteDate: Date.now() },
        { new: true }
      );
    } else if (LeadStatus == "Hot") {
      lead = await Lead.findByIdAndUpdate(
        id,
        { HotNote: Note, NoteDate: Date.now() },
        { new: true }
      );
    } else {
      // for warm
      lead = await Lead.findByIdAndUpdate(
        id,
        { WarmNote: Note, NoteDate: Date.now() },
        { new: true }
      );
    }

    res.status(200).json({ message: "Lead Note updated successfully", lead });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      status: false,
      message: "internal server error ",
    });
  }
});

// ====================for doc things======================

export const createDocFile = asyncHandler(async (req, res) => {

  const { file } = req.body;

  const taking = Document.create({ file });

  return {
    data: taking,
    status: true,
    message: "Doc Create Successfully",
  };
});

export const updateDocFiles = asyncHandler(async (req, res) => {
  const { doc } = req.body;
  const { id } = req.params;

  console.log(doc);

  const docsFile = await Lead.$where(doc, { id }).findIndex();

  console.log(docsFile.toIndex());

  return {
    status: true,
    data: docsFile,
    message: "update doc file successfullly",
  };
});

export const getDocFiles = asyncHandler(async (req, res) => {
  const docFileing = await Document.find();

  return {
    data: docFileing,
    message: "get all the Data of docs",
    status: true,
  };
});

export const deleteDocFile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const ans = await Document.findByIdAndDelete(id);
    if (ans?.user._id) {
      console.log("deleted the item successfully");
      return;
    } else {
      console.log("item deleted take some time. please wait for seconds");
    }

    return {
      status: true,
      message: "doc file deleted successfully",
      data: ans,
    };
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "server error" });
  }
});

export const role = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const { user, admin, name } = req.body;

    const setup = await Role.create({
      user: user._id,
      admin: admin.adminId,
      name,
    });

    return {
      status: true,
      message: "role is created successfully",
      data: setup,
    };
  } catch (error) {
    console.log(error);
  }
});

export const getRole = asyncHandler(async (req, res) => {
  try {
    const data = await Role.find({});

    return {
      message: "fetched all data successfully",
      data: data,
      status: true,
    };
  } catch (error) {
    console.log(error);
  }
});

export const deleteRole = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
  } catch (error) {
    console.log(error);
  }
});

// for lead notes
// CreateLeadNote , UpdateLeadNote , DeleteLeadNote
export const CreateLeadNote = async (req, res) => {
  const { LeadId } = req.params;

  const { Note, Status } = req.body;

  const noteDetail = await LeadNote.create({ Note, Status, LeadId });
  return res.status(200).json({
    status: true,
    data: noteDetail,
  });
};

export const UpdateLeadNote = async (req, res) => {
  const { noteId } = req.params;

  const { Note, Status } = req.body;

  const noteDetail = await LeadNote.findByIdAndUpdate(
    noteId,
    { Note, Status },
    { new: true }
  );
  return res.status(200).json({
    status: true,
    data: noteDetail,
  });
};

export const DeleteLeadNote = async (req, res) => {
  const { leadId } = req.params;

  await LeadNote.findByIdAndDelete(leadId);

  return res.status(200).json({
    status: true,
  });
};

export const GetNoteById = async (req, res) => {
  const { leadId } = req.params;

  const ans = await LeadNote.find({ LeadId: leadId });

  return res.status(200).json({
    status: true,
    data: ans,
  });
};

export const GetDesiUser1 = async (req, res) => {
  const users = await User.find({
    designation: {
      $in: [
        "CEO",
        "Intern Digital Marketing",
        "Business Development Manager",
        "Manager",
      ],
    },
  });

  res.status(200).json({
    status: true,
    data: users,
  });
};
