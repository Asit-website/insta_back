import Leave from "../models/Leave/Leave.js";
import HalfDay from "../models/Leave/HalfDay.js";
import User from "../models/User/User.js";
import { removeUndefined } from "../utils/util.js";
import { mailSender } from "../utils/SendMail2.js";
import EmployeeLeave from "../models/EmployeeLeave/employeeLeave.js"


export const postLeave = async ({ auth, type, from, to, days, reason }) => {
  const newLeave = new Leave({
    user: auth,
    leaveType: type,
    from,
    to,
    days,
    reason,
    status: "",
    ts: new Date().getTime()
  });


  const saveLeave = await newLeave.save();
  
  await mailSender("hr@kusheldigi.com", "Regarding Leave", `<div>
  <div>from: ${auth?.fullName}</div>
  <div>to: ${to}</div>
  <div>days: ${days + 1}</div>
  <div>reason: ${reason}</div>
  </div>`);


  return { success: true, message: "New leave created" };
};

export const postHalfDay = async ({ auth,  from, to, days, reason }) => {
  const newLeave = new HalfDay({
    user: auth,
    from,
    to,
    days,
    reason,
    status: "",
    ts: new Date().getTime()
  });


  const saveLeave = await newLeave.save();
  
  await mailSender("hr@kusheldigi.com", "Regarding Half Day", `<div>
  <div>from: ${auth?.fullName}</div>
  <div>to: ${to}</div>
  <div>days: ${days + 1}</div>
  <div>reason: ${reason}</div>
  </div>`);

  return { success: true, message: "New leave created" };
};

export const postAllowance = async ({ user , allowance }) => {

  const userDetail = await User.findById(user).populate("PermissionRole");

  userDetail.userAllowance = allowance;
  await userDetail.save();

  return { success: true, message: "New allowance created" ,userDetail };
};

export const LeaveTypeApi = async ({ id }) => {

  const userLeave = await Leave.find({user:id});

   const paidLeave = userLeave.filter((lev)=> lev?.leaveType === "Paid Leave" || lev?.leaveType === '' );
   const casualLeave = userLeave.filter((lev)=> lev?.leaveType === "Casual Leave" || lev?.leaveType === 'Sick Leave');
 
  return { success: true, message: "New allowance created" , data:{paidLeave: paidLeave?.length , casualLeave : casualLeave?.length , totalLeaves:userLeave.length} };
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// export const monthlyLeave = async(req , res)=>{
//   const {month} = req.body;
//  if(month){
//   const now = new Date();
//     const year = now.getFullYear();
    
//     // If month is provided, ensure it's a valid number between 1 and 12
//     if (month < 1 || month > 12) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid month value"
//       });
//     }

//     // Calculate the start and end dates for the specified month
//     const startOfMonth = new Date(year, month - 1, 1);
//     const endOfMonth = new Date(year, month, 0); // Last day of the month

//     // Format dates if needed
//     const formattedStartOfMonth = formatDate(startOfMonth);
//     const formattedEndOfMonth = formatDate(endOfMonth);

//     // Fetch leave records within the specified month
//     const leaves = await Leave.find({
//       from: { $gte: formattedStartOfMonth },
//       to: { $lte: formattedEndOfMonth },
//       status: 'Accepted'
//     }).populate("user");

//     console.log("leave",leaves);

//     return res.status(200).json({
//       status: true,
//       data: leaves
//     });
//  }
//  else {
//   const now = new Date();
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
//   const formattedStartOfMonth = formatDate(startOfMonth);

//   const leaves = await Leave.find({
//     from: { $gt: formattedStartOfMonth },
//     status:'Accepted'
//   }).populate("user");
  
//   return res.status(200).json({
//     status:true ,
//     data:leaves
//   })
//  }

// }

export const monthlyLeave = async (req, res) => {
  const { month } = req.body;


  const now = new Date();
  const year = now.getFullYear();
  
  // Determine the month to be used (provided month or current month)
  const targetMonth = month ? month - 1 : now.getMonth();

  // Calculate the start and end dates for the specified month
  const startOfMonth = new Date(year, targetMonth, 1);
  const endOfMonth = new Date(year, targetMonth + 1, 0); // Last day of the month

  // Format dates if needed
  const formattedStartOfMonth = formatDate(startOfMonth);
  const formattedEndOfMonth = formatDate(endOfMonth);

  // Fetch leave records within the specified month
  const leaves = await Leave.find({
    from: { $gte: formattedStartOfMonth },
    to: { $lte: formattedEndOfMonth },
    status: 'Accepted',
  }).populate("user");

  // Consolidate leaves by user
  const consolidatedLeaves = {};

  leaves.forEach((leave) => {
 
    const userId = leave.user._id.toString();
    const leaveDays = parseInt(leave.days)+1;

    if (!consolidatedLeaves[userId]) {
      consolidatedLeaves[userId] = {
        user: leave.user,
        totalDays: 0,
        sickLeave:0 ,
        paidLeave:0,
        UnpaidLeave:0,
        casualLeave:0 ,
        other:0 ,
        paidLeave:0
      
      };
    }

    consolidatedLeaves[userId].totalDays += leaveDays;

 
    if (leave?.leaveType === 'Sick Leave' && leaveDays != NaN) {
      consolidatedLeaves[userId].sickLeave += leaveDays;
    }
   else if (leave?.leaveType === 'Unpaid Leave' && leaveDays != NaN) {
      consolidatedLeaves[userId].UnpaidLeave += leaveDays;
    }
   else if (leave?.leaveType === 'Casual Leave' && leaveDays != NaN) {
      consolidatedLeaves[userId].casualLeave += leaveDays;
    }
   else if (leave?.leaveType === 'Paid Leave' && leaveDays != NaN) {
      consolidatedLeaves[userId].paidLeave += leaveDays;
    }
    else {
        consolidatedLeaves[userId].other += leaveDays;
      }
    

  });

  // Convert consolidated leaves object to an array
  const result = Object.values(consolidatedLeaves);

  return res.status(200).json({
    status: true,
    data: result,
  });
};

export const updateLeave = async ({ auth, employeeName, id, leaveType, from, to, days, reason, status }) => {
  let updateObj = removeUndefined({
    leaveType, from, to, days, reason
  });

  const updateLeave = await Leave.findByIdAndUpdate(
    id,
    { $set: updateObj },
    { new: true }
  );

  console.log(updateLeave);

  const employe = await User.findOne({ fullName: employeeName });

  await mailSender(employe.email, "update Leave ", `<div>
   <div>from: ${auth?.fullName}</div>
   <div>to: ${to}</div>
   <div>days: ${(days) +1}</div>
   <div>reason: ${reason}</div>
  </div>`)


  return { success: true, message: "Leave updated" };
};

export const getUserLeaves = async ({ auth }) => {
  const data = await Leave.find({}).populate('user'); // Populate the 'user' field
  return { success: true, data };
};

export const getUserHalfDay = async ({ auth }) => {
  const data = await HalfDay.find({}).populate('user'); // Populate the 'user' field
  return { success: true, data };
};

export const getUserLeaveById = async ({ auth, id }) => {
  if (!auth) {
    return { success: false, message: "Not Authorised" };
  }

  const data = await Leave.findById(id);
  return { success: true, data };
};

export const deleteLeave = async ({ auth, id }) => {
  if (!auth) {
    return { success: false, message: "Not Authorised" };
  }

  const data = await Leave.findByIdAndDelete(id);
  return { success: true, data };
};

export const deleteAllLeaves = async () => {
  const data = await Leave.deleteMany();
  return { success: true, data };
};

export const getTotalLeaveCount = async () => {
  // const data = await Leave.find({status:"Pending"});

  const data = await Leave.find({
    $or: [
      { status: "Pending" },
      { status: "" },
      { status: { $exists: false } }
    ]
  });

  const data2 = await HalfDay.find({
    $or: [
      { status: "Pending" },
      { status: "" },
      { status: { $exists: false } }
    ]
  });

  const totalLeave = data.length;
  const halfDay = data2.length;

  return {
    success: true,
    totalLeave , halfDay
  }
}

export const rejectLeaveHandler = async ({ fullName, id }) => {

  const leaveDetails = await Leave.findById(id);

  leaveDetails.status = "Rejected";

  await leaveDetails.save();

  const userDetail = await User.findOne({ fullName: fullName });



  await mailSender(userDetail?.email, "Regarding holiday cancel ", `<div>
<div>Your holidays are cancel by admin</div>

</div>`)


  return {
    status: true,
    message: "Successfuly send the email"
  }
}

export const rejectHalfDayHandler = async ({ fullName, id }) => {

  const leaveDetails = await HalfDay.findById(id);

  leaveDetails.status = "Rejected";

  await leaveDetails.save();

  const userDetail = await User.findOne({ fullName: fullName });

  await mailSender(userDetail?.email, "Regarding Half Day Cancel ", `<div>
<div>Your Half Days are cancel by admin</div>

</div>`)


  return {
    status: true,
    message: "Successfuly send the email"
  }
}

export const acceptLeaveHandler = async ({ fullName, days, id, userId, startDate, endDate }) => {

  const leaveDetails = await Leave.findById(id);

  leaveDetails.status = "Accepted";

  await leaveDetails.save();

  const userDetail = await User.findOne({ fullName: fullName });

  const subject = `total holiday of ${days} days`;

  await mailSender(userDetail?.email, "Accept Leave ", `<div>
   <div>total holiday of ${parseInt(days)+1} days Accepted</div>

  </div>`)


  const leaveDetailing = await EmployeeLeave.create({ startDate, endDate, user: userId });

  return {
    status: true,
    message: "Successfuly send the email"
  }


}
export const acceptHalfDayHandler = async ({ fullName, days, id, userId, startDate, endDate }) => {

  const leaveDetails = await HalfDay.findById(id);

  leaveDetails.status = "Accepted";

  await leaveDetails.save();

  const userDetail = await User.findOne({ fullName: fullName });

  const subject = `total Half Day of ${days} days`;

  await mailSender(userDetail?.email, "Accept Half Day ", `<div>
   <div>total Half Days of ${parseInt(days)+1} days Accepted</div>

  </div>`)


  // const leaveDetailing = await EmployeeLeave.create({ startDate, endDate, user: userId });

  return {
    status: true,
    message: "Successfuly send the email"
  }


}

// this is employee leave controllers 

export const GetTodayLeave = async (req, res) => {
  try {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    const employeesOnLeave = await EmployeeLeave.find({
      startDate: { $lte: todayDate },
      endDate: { $gte: todayDate }
    }).populate('user');


    return res.status(200).json({
      status: true,
      message: "Successfuly fetched",
      data: employeesOnLeave
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "INterval server error "
    })
  }
}