import Branch from "../models/Branch/Branch.js";
import Department from "../models/Department/Department.js";
import Designation from "../models/Designation/Designation.js";
import LeaveType from "../models/LeaveType/LeaveType.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { removeUndefined } from "../utils/util.js";
import Document from "../models/Document/Document.js";
import Industry from "../models/Industry/Industry.js";
import LeadStatus from "../models/Leadstatus/LeadStatus.js";
import LeadSource from "../models/LeadSource/LeadSource.js";

import User from "../models/User/User.js";
import LeadStat from "../models/LeadStat/LeadStat.js";
import FollowUpType from "../models/FollowUpType/FollowUpType.js";
export const postLeaveType = asyncHandler(async (req, res) => {
  const { name, days } = req.body;
  const existLeave = await LeaveType.findOne({ name });
  if (existLeave) {
    return res.status(400).json({
      success: false,
      message: "Leave Name Alreday Exist",
    });
  }
  const newLeaveType = await LeaveType.create({
    name,
    days,
    ts: new Date().getTime(),
    status: "true",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newLeaveType, " successfully posted"));
});

export const updateLeaveType = asyncHandler(async (req, res) => {
  const { status, name, days } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ status, name, days });
  // console.log(status, name);
  // console.log(id);

  const updateuserLeaveType = await LeaveType.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateuserLeaveType, "Updated  Successfully"));
});

export const getLeaveTypes = asyncHandler(async (req, res) => {
  const data = await LeaveType.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "LeaveTypees fetched Successfully"));
});

export const deleteLeaveType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await LeaveType.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const postBranch = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existBranchName = await Branch.findOne({ name });
  if (existBranchName) {
    return res.status(400).json({
      success: false,
      message: "Branch Name Alreday Exist",
    });
  }
  const newBranch = await Branch.create({
    name,
    ts: new Date().getTime(),
    status: "true",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newBranch, " successfully posted", existBranchName));
});

export const updateBranch = asyncHandler(async (req, res) => {
  const { status, name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ status, name });
  // console.log(status, name);
  // console.log(id);

  const updateuserBranch = await Branch.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateuserBranch, "Updated  Successfully"));
});

export const getBranchs = asyncHandler(async (req, res) => {
  const data = await Branch.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "branches fetched Successfully"));
});

export const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Branch.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const postDepartment = asyncHandler(async (req, res) => {
  const { name, branch } = req.body;
  const existDepartment = await Department.findOne({ name });
  if (existDepartment) {
    return res.status(400).json({
      success: false,
      message: "Department Name Alreday Exist",
    });
  }
  const newDepartment = await Department.create({
    name,
    branch,
    ts: new Date().getTime(),
    status: "true",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newDepartment, " successfully posted"));
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { status, name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ status, name });
  const updateuserDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateuserDepartment, "Updated  Successfully"));
});

export const getDepartments = asyncHandler(async (req, res) => {
  const data = await Department.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Departments fetched Successfully"));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Department.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const postDesignation = asyncHandler(async (req, res) => {
  const { name, department } = req.body;
  console.log(req.body);
  const existDesignation = await Designation.findOne({ name });
  if (existDesignation) {
    return res.status(400).json({
      success: false,
      message: "Designation Name Alreday Exist",
    });
  }
  const newDesignation = await Designation.create({
    name,
    department,
    ts: new Date().getTime(),
    status: "true",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newDesignation, " successfully posted"));
});

export const updateDesignation = asyncHandler(async (req, res) => {
  const { status, name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ status, name });
  const updateuserDesignation = await Designation.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateuserDesignation, "Updated  Successfully"));
});

export const getDesignation = asyncHandler(async (req, res) => {


  const data = await Designation.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Designationes fetched Successfully"));


});
export const getDesignations = asyncHandler(async (req, res) => {


  const { id } = req.params;

  const designations = await Designation.find({ 'department._id': id }).select('name _id');

  return res
    .status(200)
    .json(new ApiResponse(200, designations, "Designationes fetched Successfully"));


});

export const getEmployess = asyncHandler(async (req, res) => {


  const { id } = req.params;

  const users = await User.find({ 'department._id': id }).select('fullName _id');

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched Successfully"));


});

export const deleteDesignation = asyncHandler(async (req, res) => {
  console.log('yes');
  const { id } = req.params;

  const data = await Designation.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});


export const createDocSetup = asyncHandler(async(req ,res)=>{
 try{
  const {name , requiredField,documentType} = req.body;
  console.log('naesm ',name , requiredField);

  


  const details = await Document.create({name , requiredField:requiredField, documentType:documentType});

  //  console.log({documentType:documentType});

   const userEmployee = await User.findOne({fullName: req.user._id});

   console.log(userEmployee);

   for (user of userEmployee){
      const ans = await details.save();
      console.log(ans);
   }

   return res.status(200).json({
    status:true ,
    message:"Successfuly created"
   })
 } catch(error){
  console.log(error);
 }
})


export const updateDocSetup = asyncHandler(async (req, res) => {
  const { name, requiredField } = req.body;
  const { id } = req.params;

  try {
    const details = await Document.findByIdAndUpdate(
      id,
      { name, requiredField },
      { new: true, runValidators: true }
    );

    if (!details) {
      return res.status(404).json({
        status: false,
        message: "Document not found",
      });
    }

    console.log('details', details);

    return res.status(200).json({
      status: true,
      message: "Successfully updated",
      data: details,
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
});


export const deleteDocSetup = asyncHandler(async(req ,res)=>{
  try{

    const {id} = req.params;

     const details = await Document.findByIdAndDelete(id);


     return res.status(200).json({
      status:true ,
      message:"Successfuly deleted"
     })
     
  }catch(error){
    console.log(error);
    return res.status(500).json({
      status:false ,
      message:"INTERNAL Server error "
    })
  }
})


export const fetchAllDocs = asyncHandler(async(req ,res)=>{
  try{

    const allDocs = await Document.find({});

    return res.status(200).json({
      status:true ,
      message:"done " , 
      data:allDocs
    })

  } catch(error){
 console.log(error);
  }
})


export const postLeadSource = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existLeadSourceName = await LeadSource.findOne({ name });
  if (existLeadSourceName) {
    return res.status(400).json({
      success: false,
      message: "LeadSource Name Alreday Exist",
    });
  }
  const newLeadSource = await LeadSource.create({
    name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newLeadSource, " successfully posted", existLeadSourceName));
});

export const getLeadSources = asyncHandler(async (req, res) => {
  const data = await LeadSource.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "leadSources fetched Successfully"));
});

export const updateLeadSources = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({name});
  // console.log(status, name);
  // console.log(id);

  const updateLeadsources = await LeadSource.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateLeadsources, "Updated  Successfully"));
});

export const deleteLeadSource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await LeadSource.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const postIndustry = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existIndustry = await Industry.findOne({ name });
  if (existIndustry) {
    return res.status(400).json({
      success: false,
      message: "LeadSource Name Alreday Exist",
    });
  }
  const newIndustry = await Industry.create({
    name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newIndustry, " successfully posted", existIndustry));
});

export const getIndustry = asyncHandler(async (req, res) => {
  const data = await Industry.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Industry fetched Successfully"));
});

export const updateIndustry = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({name});
  // console.log(status, name);
  // console.log(id);

  const updateIndustry = await LeadStatus.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateIndustry, "Updated  Successfully"));
});

export const deleteIndustry = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const data = await LeadStatus.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});


// ==================lead status========================
export const PostLeadStat = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existLeadStat = await LeadStat.findOne({ name });
  if (existLeadStat) {
    return res.status(400).json({
      success: false,
      message: "LeadSource Name Alreday Exist",
    });
  }
  const newStat = await LeadStat.create({
    name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newStat, " successfully posted", existLeadStat));
});

export const getLeadStat = asyncHandler(async (req, res) => {
  const data = await LeadStat.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Lead Status fetched Successfully"));
});

export const updateLeadStat = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({name});
  // console.log(status, name);
  // console.log(id);

  const updateLeadStatus = await LeadStat.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateLeadStatus, "Updated  Successfully"));
});

export const deleteLeadStat = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const data = await LeadStat.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});



export const PostFollow = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existFollow = await FollowUpType.findOne({ name });
  if (existFollow) {
    return res.status(400).json({
      success: false,
      message: "FollowUp Name Alreday Exist",
    });
  }
  const newStat = await FollowUpType.create({
    name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newStat, " successfully posted", existFollow));
});

export const getFollow = asyncHandler(async (req, res) => {
  const data = await FollowUpType.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Follow up fetched Successfully"));
});

export const updateFollow = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({name});
  // console.log(status, name);
  // console.log(id);

  const updateFollowUp = await FollowUpType.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateFollowUp, "Updated  Successfully"));
});

export const deleteFollow = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const data = await FollowUpType.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});







