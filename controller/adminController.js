import Admin from "../models/Admin/Admin.js";
import Hr from "../models/Hr/Hr.js";
import Indicator from "../models/Indicator/Indicator.js";
import Apprisal from "../models/Apprisial/Apprisal.js";
import Assets from "../models/Assets/Assets.js";
import Announcement from "../models/Announcement/Announcement.js";
import Tracking from "../models/Tracking/Tracking.js";
import Termination from "../models/Termination/Termination.js";
import Warning from "../models/Warning/Warning.js";
import Complain from "../models/Complain/Complain.js";
import Resignation from "../models/Resignation/Resignation.js";
import Promotion from "../models/Promotion/Promotion.js";
import User from "../models/User/User.js";
import Project from "../models/Project/Project.js";
import Trainer from "../models/Trainer/Trainer.js";
import TrainingList from "../models/TrainingList/TrainingList.js";
import Holiday from "../models/Holiday/Holiday.js";
import Transfer from "../models/Transfer/tranfer.js";
import Trip from "../models/Trip/Trip.js";
import { createTransport } from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { SendEmail } from "../utils/SendEmail.js";
import bcrypt from "bcryptjs";
import { removeUndefined } from "../utils/util.js";
import { mailSender } from "../utils/SendMail2.js";
import Lead from "../models/Lead/Lead.js";
import Invoice from "../models/Invoice/Invoice.js";
import Salary from "../models/Salary/Salary.js";
import EmployeeType from "../models/EmployeeType/employeeType.js"
import Quatation from "../models/Quatation/Quatation.js";
import Leave from "../models/Leave/Leave.js";
import Notification from "../models/Notification/Notification.js"

export const getAdmins = asyncHandler(async (req, res) => {
  const admin = await Admin.find({}).select("-password ");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: admin,
      },
      "Successfully feteched all admins"
    )
  );
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        message: `your profile is found: ${req.user.fullName}`,
        user: req.user,
      },
      "successfully fetched your profile"
    )
  );
});

export const ChangeCurrentAdminPassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  if (newpassword !== confirmpassword) {
    throw new ApiError(401, "New passwords do not match");
  }

  const admin = await Admin.findById(req.user._id);
  const passwordcheck = await admin.isPasswordCorrect(oldpassword);
  if (!passwordcheck) {
    throw new ApiError(401, "invalid User Old Password");
  }
  admin.password = newpassword;
  await admin.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully Password Changed"));
});

const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
};

export const DepartmentEmployee = asyncHandler(async (req, res) => {
  const { department } = req.body;


  const allUser = await User.find({ department: department });
  return res.status(200).json({
    status: true,
    allUser
  })
})

export const CreateNewHr = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      password,
      department,
      gmail,
      reportingManager,
      designation,
      joiningDate,
      email,
      email1,
      mobile,
      gender,
      dob,
      pan,
      adhar,
      father,
      currentAddress,
      currentState,
      currentCity,
      currentPin,
      residence,
      perState,
      perCity,
      perPin,
      Martial,
      nationality,
      Mother,
      qualification,
      specialization,
      qualificationType,
      yearPass,
      university,
      college,
      percentage,
      previousCompany,
      previousDesignation,
      toDate,
      fromDate,
      numberOfMonth,
      Jobdescription,
      SalaryPay,
      SalaryBankName,
      BeneficiaryName,
      BankIfsc,
      AccountNumber,
      confirmAccount,
      Branch,
    } = req.body;

    const existedUser = await Hr.findOne({
      $or: [{ mobile }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const plainTextPassword = password;

    const hashedPassword = await bcrypt.hash(password, 10);

    let employeeCode1 = makeid(7);

    // <div>Employee ID: KDS${employeeCode1}</div>
    // <div>Password: ${plainTextPassword}</div>
    const message = `<div>
          Welcome aboard! We are excited to have you as a part of our team and introduce you to our HRMS system. Here, you’ll find a centralized platform for managing essential HR-related tasks and accessing important information.
<br/>
Your account has been successfully created and below are your login details:
<br/>
- employeeCode: KDS${employeeCode1} 
- Temporary ${plainTextPassword}:
<br/>
Please use the link below to log in for the first time. For security purposes, we recommend changing your password after your initial login.
<br/>
Login Here; ${`https://hrms.kusheldigi.com/login`}

<br/>
If you have any questions or need assistance, please don’t hesitate to reach out to our support team.

Welcome once again!
<br/>
Best Regards, 
Kushel Digi Solutions
     </div>
     `;
    const html = `
        <div>
          Welcome aboard! We are excited to have you as a part of our team and introduce you to our HRMS system. Here, you’ll find a centralized platform for managing essential HR-related tasks and accessing important information.
<br/>
Your account has been successfully created and below are your login details:
<br/>
- employeeCode: KDS${employeeCode1} 
- Temporary ${plainTextPassword}:
<br/>
Please use the link below to log in for the first time. For security purposes, we recommend changing your password after your initial login.
<br/>
Login Here; ${`https://hrms.kusheldigi.com/login`}

<br/>
If you have any questions or need assistance, please don’t hesitate to reach out to our support team.

Welcome once again!
<br/>
Best Regards, 
Kushel Digi Solutions
     </div>
     `;

    await SendEmail(email, "Login Details", message, html);

    const newHr = await Hr.create({
      fullName,
      role: "HR",
      department,
      gmail,
      password: hashedPassword,
      reportingManager,
      designation,
      joiningDate,
      email,
      email1,
      mobile,
      gender,
      dob,
      pan,
      employeeCode: employeeCode1,
      adhar,
      father,
      currentAddress,
      currentState,
      currentCity,
      currentPin,
      residence,
      perState,
      perCity,
      perPin,
      Martial,
      nationality,
      Mother,
      qualification,
      specialization,
      qualificationType,
      yearPass,
      university,
      college,
      percentage,
      previousCompany,
      previousDesignation,
      toDate,
      fromDate,
      numberOfMonth,
      Jobdescription,
      SalaryPay,
      SalaryBankName,
      BeneficiaryName,
      BankIfsc,
      AccountNumber,
      confirmAccount,
      Branch,
      createdBy: req.user.role,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          newHr,
        },
        "Admin account created successfully"
      )
    );
  } catch (error) {
    // console.log(employeeCode1);
    console.log("the error is :", error.message);
  }
});

export const CreateNewUser = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      password,
      department,
      gmail,
      reportingManager,
      designation,
      joiningDate,
      email,
      email1,
      mobile,
      gender,
      dob,
      pan,
      adhar,
      father,
      currentAddress,
      currentState,
      currentCity,
      currentPin,
      residence,
      perState,
      perCity,
      perPin,
      Martial,
      nationality,
      Mother,
      qualification,
      specialization,
      qualificationType,
      yearPass,
      university,
      college,
      percentage,
      previousCompany,
      previousDesignation,
      toDate,
      fromDate,
      numberOfMonth,
      Jobdescription,
      SalaryPay,
      SalaryBankName,
      BeneficiaryName,
      BankIfsc,
      AccountNumber,
      confirmAccount,
      Branch,
      employeeType , 
      PermissionRole
    } = req.body;

    const employeeCode = makeid(7);

    const message = `
    <div>
          Welcome aboard! We are excited to have you as a part of our team and introduce you to our HRMS system. Here, you’ll find a centralized platform for managing essential HR-related tasks and accessing important information.
<br/>
Your account has been successfully created and below are your login details:
<br/>
- employeeCode: KDS${employeeCode} 
- Temporary ${password}:
<br/>
Please use the link below to log in for the first time. For security purposes, we recommend changing your password after your initial login.
<br/>
Login Here; ${`https://hrms.kusheldigi.com/login`}

<br/>
If you have any questions or need assistance, please don’t hesitate to reach out to our support team.

Welcome once again!
<br/>
Best Regards, 
Kushel Digi Solutions
     </div>
  `;

    const html = `
      <div>
          Welcome aboard! We are excited to have you as a part of our team and introduce you to our HRMS system. Here, you’ll find a centralized platform for managing essential HR-related tasks and accessing important information.
<br/>
Your account has been successfully created and below are your login details:
<br/>
- employeeCode: KDS${employeeCode} 
- Temporary ${password}:
<br/>
Please use the link below to log in for the first time. For security purposes, we recommend changing your password after your initial login.
<br/>
Login Here; ${`https://hrms.kusheldigi.com/login`}

<br/>
If you have any questions or need assistance, please don’t hesitate to reach out to our support team.

Welcome once again!
<br/>
Best Regards, 
Kushel Digi Solutions
     </div>
  `;

    await SendEmail(email, "Login Details", message, html);


    const adminUser = await User.create({
      department,
      password,
      fullName,
      gmail,
      reportingManager,
      designation,
      joiningDate,
      email,
      email1,
      mobile,
      gender,
      dob,
      employeeCode,
      pan,
      adhar,
      father,
      currentAddress,
      currentState,
      currentCity,
      currentPin,
      residence,
      perState,
      perCity,
      perPin,
      Martial,
      nationality,
      role: department === "Hr" ? "HR" : department === "Manager" ? "MANAGER" : "EMPLOYEE",
      Mother,
      qualification,
      specialization,
      qualificationType,
      yearPass,
      university,
      college,
      percentage,
      previousCompany,
      previousDesignation,
      toDate,
      fromDate,
      numberOfMonth,
      Jobdescription,
      SalaryPay,
      SalaryBankName,
      BeneficiaryName,
      BankIfsc,
      AccountNumber,
      confirmAccount,
      Branch,
      EmployeeType: employeeType ,
      PermissionRole: (PermissionRole === "Select Role" || PermissionRole === "") ? null : PermissionRole
    });


    const empType = await EmployeeType.create({ type: employeeType, users: adminUser?._id });

    return res.status(200).json(
      {
        status: true,
        message: "Successfuly created ",
        data: adminUser
      }
    );
  } catch (error) {
    console.log("the error is :", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { fullName, dob, mobile, email, password } = req.body;
  if (
    [fullName, email, mobile, dob, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const profileImageLocalPath = req.file.path;
  if (!profileImageLocalPath) {
    throw new ApiError(400, "Profile local path is notfound");
  }
  const profileImage = await uploadToCloudinary(profileImageLocalPath);

  if (!profileImage) {
    throw new ApiError(400, "error uploading on cloudinary");
  }
  const existedUser = await User.findOne({
    $or: [{ fullName }, { email }],
  });
  if (existedUser) {
    return res.status(400).json({
      success: false,
      message: "Admin Already Exists",
    });
  }

  const adminUser = await Admin.create({
    fullName,
    dob,
    mobile,
    email,
    role: "ADMIN",
    profileImage: profileImage?.url,
    password,
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        adminUser,
      },
      "Admin account created successfully"
    )
  );
});

export const updateAdmindetails = asyncHandler(async (req, res) => {
  try {
    const { fullName, dob, mobile, email, employeeCode } = req.body;
    const updateObj = removeUndefined({
      fullName,
      dob,
      mobile,
      email,
      employeeCode,
    });

    const admin = await Admin.findByIdAndUpdate(req.user._id, updateObj, {
      new: true,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, admin, "Updated User Details Successfully"));
  } catch (error) {
    console.log("error is ", error.message);
    throw new ApiError(error.status || 500, "internal server error");
  }
});

const generateRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(userId);

    if (!admin) {
      throw new ApiError(404, "admin not found");
    }

    const token = admin.generateAuthToken();

    return token;
  } catch (error) {
    // Log the actual error for debugging purposes
    console.error("Error in generateRefreshToken:", error.message);

    throw new ApiError(500, "Something went wrong");
  }
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new ApiError(404, "Admin  not found");
    }
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const token = await generateRefreshToken(admin._id);

    const loggedAdmin = await Admin.findById(admin._id).select("-password ");

    return res.json(
      new ApiResponse(
        200,
        {
          user: loggedAdmin,
          token,
        },
        "Admin is successfully logged in"
      )
    );
  } catch (error) {
    console.log("error is ", error.message);
  }
});

export const topDash = async ({ auth }) => {
  // todo
  const hrs = auth.usersCreated;
  const projects = await Project.find({ hr: { $in: hrs } });
  const employees = await Admin.find({ hr: { $in: hrs } });

  return {
    success: true,
    projectsLength: projects.length,
    projects,
    employees,
  };
};

export const postIndicator = asyncHandler(async (req, res) => {
  const { Branch, Department, Designation, businessProcessRating, projectManagemntRating } = req.body;

  // retreiving all the user of same department and designation 
  const users = await User.find({ department: Department, designation: Designation });

  //  Extract email addresses from the retrieved user 
  const emailList = users.map(user => user.email);

  for (const email of emailList) {
    await SendEmail(email);
    console.log(`Email sent to ${email}`);
  }


  const indicator = await Indicator.create({
    Branch,
    Department,
    Designation,
    businessProcessRating,
    projectManagemntRating,
    ts: new Date().getTime(),
    status: "true",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, indicator, " successfully posted"));
});

export const getIndicator = asyncHandler(async (req, res) => {
  const data = await Indicator.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Indicator"));
});

export const deleteIndicator = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Indicator.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const updateIndicator = asyncHandler(async (req, res) => {
  const { Branch, Department, Designation, businessProcessRating, projectManagemntRating } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ Branch, Department, Designation, businessProcessRating, projectManagemntRating });


  // retreiving all the user of same department and designation 
  const users = await User.find({ department: Department, designation: Designation });

  //  Extract email addresses from the retrieved user 
  const emailList = users.map(user => user.email);


  for (const email of emailList) {
    await mailSender(email, `Regarding UpdateIndicator`, `<div>
      <div>Description: ${updateObj}</div>
      </div>` );
  }


  const updateIndicator = await Indicator.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateIndicator, "Updated  Successfully"));
});

export const postApprisal = asyncHandler(async (req, res) => {

  const { Branch, SelectMonth, Employee, remarks } = req.body;


  // retreiving all the user of same department and designation 
  const userDetail = await User.findOne({ fullName: Employee });

  await mailSender(userDetail.email, `Regarding Create Apprisal`, `<div>
    <div>Branch By: ${Branch}</div>
    <div>SelectMonth: ${SelectMonth}</div>
    <div>Employee: ${Employee}</div>
    <div>remarks: ${remarks}</div>
    </div>`);

  const apprisal = await Apprisal.create({
    Branch,
    SelectMonth,
    Employee,
    remarks
  });
  return res
    .status(200)
    .json(new ApiResponse(200, apprisal, " successfully posted"));
});

export const getApprisal = asyncHandler(async (req, res) => {

  const data = await Apprisal.find({}).sort({ Branch: "-1" }).lean();

  const newData = [];
  for (const item of data) {
    const user = await User.findOne({ fullName: item.Employee }).select('designation department');

    if (user) {
      // Add user's designation and department to the item
      item.designation = user.designation;
      item.department = user.department;
    }

    newData.push(item);
  }


  return res
    .status(200)
    .json(new ApiResponse(200, newData, " Successfully fetched all the Apprisal"));

});


export const fetchEmployee = asyncHandler(async (req, res) => {

  const { department } = req.body;

  const emp = await User.find({ department: department });

  return res.status(200).json({
    status: true,
    emp
  })


})

export const fetchAllEmployee = asyncHandler(async (req, res) => {
  const emp = await User.find({});

  return res.status(200).json({
    status: true,
    emp
  })
})

export const deleteApprisal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Apprisal.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const updateApprisal = asyncHandler(async (req, res) => {
  const { Branch, SelectMonth, Employee, remarks } = req.body;
  const { id } = req.params;

  // retreiving all the user of same department and designation 
  const userDetail = await User.findOne({ fullName: Employee });

  await mailSender(userDetail.email, "Regarding Update Apprisal", `<div>
  <div>Branch: ${Branch}</div>
  <div>SelectMonth: ${SelectMonth}</div>
  <div>Employee: ${Employee}</div>
  <div>remarks: ${remarks}</div>
  </div>`);


  let updateObj = removeUndefined({ Branch, SelectMonth, Employee, remarks });

  const updateApprisal = await Apprisal.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateApprisal, "Updated  Successfully"));
});

// =====================assets controller start================

export const Acceptassetsapi = asyncHandler(async (req, res) => {

  const { assetId } = req.body;

  const assetdetail = await Assets.findById(assetId);

  assetdetail.status = "Accepted";
  await assetdetail.save();


  return res.status(200).json(new ApiResponse(200, assetdetail, " successfully posted"));
});

export const postAssets = asyncHandler(async (req, res) => {

  const { Employee,
    designation,
    department,
    product,
    purchaseDate,
    additonal,
    description
  } = req.body;

  const users = await User.findOne({ fullName: Employee })



  const apprisal = await Assets.create({
    Employee,
    designation,
    department,
    product,
    purchaseDate,
    additonal,
    description
  });

  await mailSender(users.email, "Regarding Create Assets", `<div>
    <div>Employee: ${Employee}</div>
    <div>designation: ${designation}</div>
    <div>Department: ${department}</div>
    <div>product: ${product}</div>
    <div>To Date: ${purchaseDate}</div>
    <div>Additional Product: ${additonal}</div>
    <div>description: ${description}</div>
       <div>To accept, click the link below:</div>
    <a href="https://hrms.kusheldigi.com/accept/${apprisal?._id}">Accept Assets</a>
    </div>`);




  return res
    .status(200)
    .json(new ApiResponse(200, apprisal, " successfully posted"));
});

export const getAssets = asyncHandler(async (req, res) => {

  const data = await Assets.find({}).sort({ Branch: "-1" }).lean();

  const newData = [];
  for (const item of data) {
    const user = await User.findOne({ fullName: item.Employee }).select('designation department');

    if (user) {
      // Add user's designation and department to the item
      item.designation = user.designation;
      item.department = user.department;
      // item.email = user.email
    }

    newData.push(item);
  }


  return res
    .status(200)
    .json(new ApiResponse(200, newData, " Successfully fetched all the Assets"));

});

export const deleteAssets = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Assets.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const updateAssets = asyncHandler(async (req, res) => {
  const { Employee,
    designation,
    department,
    product,
    purchaseDate,
    additonal,
    description } = req.body;

  const { id } = req.params;

  // const users = await User.findOne({ _id: id });
  const users = await User.findOne({ fullName: Employee })

  await mailSender(users.email, "Regarding Create Assets", `<div>
  <div>Employee: ${Employee}</div>
  <div>designation: ${designation}</div>
  <div>Department: ${department}</div>
  <div>product: ${product}</div>
  <div>To Date: ${purchaseDate}</div>
  <div>Additional Product: ${additonal}</div>
  <div>description: ${description}</div>
  </div>`);

  console.log(`mail send to ${users}`);



  let updateObj = removeUndefined({
    Employee,
    designation,
    department,
    product,
    purchaseDate,
    additonal,
    description
  });

  const updateApprisal = await Assets.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateApprisal, "Updated  Successfully"));
});


// =========================GOAL TRACKING API START================
export const postTracking = asyncHandler(async (req, res) => {

  const { Branch, GoalType, startDate, endDate, subject, target, description, status, rating, progress } = req.body;

  const tracking = await Tracking.create({ Branch, GoalType, startDate, endDate, subject, target, description, status, rating, progress });
  return res
    .status(200)
    .json(new ApiResponse(200, tracking, " successfully posted"));
});

export const getTracking = asyncHandler(async (req, res) => {
  const data = await Tracking.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Tracking"));
});

export const deleteTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Tracking.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const updateTracking = asyncHandler(async (req, res) => {
  const { Branch, GoalType, startDate, endDate, subject, target, description, status, rating, progress } = req.body;
  const { id } = req.params;


  let updateObj = removeUndefined({ Branch, GoalType, startDate, endDate, subject, target, description, status, rating, progress });

  const updateTracking = await Tracking.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTracking, "Updated  Successfully"));
});

// ========================announcement controller================
export const postAnnouncement = asyncHandler(async (req, res) => {
  const { title, Branch, Department, Employee, startDate, endDate, description } = req.body;

  // retreiving all the user of same department and designation 
  if (Employee === "All Employee") {

    const users = await User.find({ department: Department });

    for (const user of users) {

      // do here

      const notify = await Notification.create({ title, description, user: user?._id });

      await mailSender(user.email, "Create Annnouncement ", `<div>
      <div>title: ${title}</div>
      <div>Branch: ${Branch}</div>
      <div>Department: ${Department}</div>
      <div>Employee: ${Employee}</div>
      <div>startDate: ${startDate}</div>
      <div>endDate: ${endDate}</div>
      <div>description: ${description}</div>
      </div>`)

    }


  }

  else {

    const user = await User.findOne({ fullName: Employee });
    const notify = await Notification.create({ title, description, user: user?._id });

    await mailSender(user?.email, "Create Annnouncement ", `<div>
    <div>title: ${title}</div>
    <div>Branch: ${Branch}</div>
    <div>Department: ${Department}</div>
    <div>Employee: ${Employee}</div>
    <div>startDate: ${startDate}</div>
    <div>endDate: ${endDate}</div>
    <div>description: ${description}</div>
    </div>`)



  }

  const announcement = await Announcement.create({
    title,
    Branch,
    Department,
    Employee,
    startDate,
    endDate,
    description: description,
    ts: new Date().getTime(),
    status: "true",

  });
  return res
    .status(200)
    .json(new ApiResponse(200, announcement, " successfully posted"));
});


export const getAnnouncement = asyncHandler(async (req, res) => {
  const data = await Announcement.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Announcement"));
});


export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Announcement.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted   Successfully"));
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { title, Branch, Department, Employee, startDate, endDate, description } = req.body;
  const { id } = req.params;
  let updateObj = removeUndefined({ title, Branch, Department, Employee, startDate, endDate, description });


  // retreiving all the user of same department and designation 
  if (Employee === "All Employee") {

    const users = await User.find({ department: Department });
    for (const user of users) {
      await mailSender(user.email, "update Annnouncement ", `<div>
      <div>title: ${title}</div>
      <div>Branch: ${Branch}</div>
      <div>Department: ${Department}</div>
      <div>Employee: ${Employee}</div>
      <div>startDate: ${startDate}</div>
      <div>endDate: ${endDate}</div>
      <div>description: ${description}</div>
      </div>`)

    }


  }
  else {

    const user = await User.findOne({ fullName: Employee });

    await mailSender(user.email, "update Annnouncement ", `<div>
    <div>title: ${title}</div>
    <div>Branch: ${Branch}</div>
    <div>Department: ${Department}</div>
    <div>Employee: ${Employee}</div>
    <div>startDate: ${startDate}</div>
    <div>endDate: ${endDate}</div>
    <div>description: ${description}</div>
    </div>`)

  }


  const updateAnnouncement = await Announcement.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateAnnouncement, "Updated  Successfully"));
});

// ==================== termination apis in backend==============

export const postTermination = asyncHandler(async (req, res) => {

  const { Employee,
    type,
    noticeDate,
    terminationDate,
    description
  } = req.body;

  const users = await User.findOne({ fullName: Employee });


  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users.email}`,
    subject: "Regarding Termination",
    html: `<div>
      <div>Termination Type: ${type}</div>
      <div>NoticeDate: ${noticeDate}</div>
      <div>TerminationDate: ${terminationDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });


  const termination = await Termination.create({
    Employee,
    type,
    noticeDate,
    terminationDate,
    description
  });
  return res
    .status(200)
    .json(new ApiResponse(200, termination, " successfully posted"));
});

export const getTermination = asyncHandler(async (req, res) => {
  const data = await Termination.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Successfully fetched all the Termination"));
});

export const deleteTermination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Termination.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateTermination = asyncHandler(async (req, res) => {
  const { Employee,
    type,
    noticeDate,
    terminationDate,
    description } = req.body;

  const { id } = req.params;

  // const users = await User.findOne({ _id: id });
  const users = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Employee,
    type,
    noticeDate,
    terminationDate,
    description
  });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users.email}`,
    subject: "Regarding Termination",
    html: `<div>
      <div>Termination Type: ${type}</div>
      <div>NoticeDate: ${noticeDate}</div>
      <div>TerminationDate: ${terminationDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });

  console.log(`mail send to ${users}`);

  const updateTermination = await Termination.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTermination, "Updated  Successfully"));
});

// ================== warning api=================

export const postWarning = asyncHandler(async (req, res) => {

  const { warningBy,
    warningTo,
    subject,
    warningDate,
    description
  } = req.body;

  // const users = await User.findOne({ fullName: warningBy });
  const users1 = await User.findOne({ fullName: warningTo });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <asitmandal492@gmail.com>',
    to: `${users1.email}`,
    subject: "Regarding Warning",
    html: `<div>
      <div>Warning By: ${warningBy}</div>
      <div>Subject: ${subject}</div>
      <div>Warning Date: ${warningDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });


  console.log(`mail send to ${users1}`);


  const termination = await Warning.create({
    warningBy,
    warningTo,
    subject,
    warningDate,
    description
  });
  return res
    .status(200)
    .json(new ApiResponse(200, termination, " successfully posted"));
});

export const getWarning = asyncHandler(async (req, res) => {
  const data = await Warning.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Warning"));
});

export const deleteWarning = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Warning.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateWarning = asyncHandler(async (req, res) => {
  const { warningBy,
    warningTo,
    subject,
    warningDate,
    description } = req.body;

  const { id } = req.params;

  const users1 = await User.findOne({ fullName: warningTo });



  let updateObj = removeUndefined({
    warningBy,
    warningTo,
    subject,
    warningDate,
    description
  });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Warning",
    html: `<div>
      <div>Warning By: ${warningBy}</div>
      <div>Subject: ${subject}</div>
      <div>Warning Date: ${warningDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });

  console.log(`mail send to ${users1}`);

  const updateTermination = await Warning.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTermination, "Updated  Successfully"));
});

export const postComplain = asyncHandler(async (req, res) => {

  const { complainFrom,
    complainAgain,
    title,
    complainDate,
    description
  } = req.body;


  const users1 = await User.findOne({ fullName: complainAgain });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Warning",
    html: `<div>
      <div>Complain From: ${complainFrom}</div>
      <div>Title: ${title}</div>
      <div>Complain Date: ${complainDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });


  console.log(`mail send to ${users1}`);


  const complain = await Complain.create({
    complainFrom,
    complainAgain,
    title,
    complainDate,
    description
  });
  return res
    .status(200)
    .json(new ApiResponse(200, complain, " successfully posted"));
});

export const getComplain = asyncHandler(async (req, res) => {
  const data = await Complain.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Warning"));
});

export const deleteComplain = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Complain.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateComplain = asyncHandler(async (req, res) => {
  const { complainFrom,
    complainAgain,
    title,
    complainDate,
    description } = req.body;

  const { id } = req.params;

  const users1 = await User.findOne({ fullName: complainAgain });



  let updateObj = removeUndefined({
    complainFrom,
    complainAgain,
    title,
    complainDate,
    description
  });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Warning",
    html: `<div>
      <div>Complain From: ${complainFrom}</div>
      <div>Title: ${title}</div>
      <div>Complain Date: ${complainDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });

  console.log(`mail send to ${users1}`);

  const updateTermination = await Complain.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTermination, "Updated  Successfully"));
});

export const postResignation = asyncHandler(async (req, res) => {

  const { Employee,
    noticeDate,
    resignationDate,
    description
  } = req.body;

  // const users = await User.findOne({ fullName: warningBy });
  const users1 = await User.findOne({ fullName: Employee });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });
  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Resignation",
    html: `<div>
      <div>Employee: ${Employee}</div>
      <div>Notice Date: ${noticeDate}</div>
      <div>Resignation Date: ${resignationDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });


  console.log(`mail send to ${users1}`);


  const resignation = await Resignation.create({
    Employee,
    noticeDate,
    resignationDate,
    description
  });
  return res
    .status(200)
    .json(new ApiResponse(200, resignation, " successfully posted"));
});

export const getResignation = asyncHandler(async (req, res) => {
  const data = await Resignation.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Resignation"));
});

export const deleteResignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Resignation.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateResignation = asyncHandler(async (req, res) => {
  const { Employee,
    noticeDate,
    resignationDate,
    description } = req.body;

  const { id } = req.params;

  const users1 = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Employee,
    noticeDate,
    resignationDate,
    description
  });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Resignation",
    html: `<div>
      <div>Employee: ${Employee}</div>
      <div>Notice Date: ${noticeDate}</div>
      <div>Resignation Date: ${resignationDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });

  console.log(`mail send to ${users1}`);

  const updateResignation = await Resignation.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateResignation, "Updated  Successfully"));
});

// ========================promotion apis===========

export const postPromotion = asyncHandler(async (req, res) => {

  const { Employee, Designation, title, promotionDate, description } = req.body;

  // const users = await User.findOne({ fullName: warningBy });
  const users1 = await User.findOne({ fullName: Employee });

  // const user2 = await User.updateOne({''})

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Promotion",
    html: `<div>
      <div>Employee: ${Employee}</div>
      <div>Designation: ${Designation}</div>
      <div>title: ${title}</div>
      <div>Promotion Date: ${promotionDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });


  console.log(`mail send to ${users1}`);


  const promotion = await Promotion.create({
    Employee, Designation, title, promotionDate, description
  });
  return res
    .status(200)
    .json(new ApiResponse(200, promotion, " successfully posted"));
});

export const getPromotion = asyncHandler(async (req, res) => {
  const data = await Promotion.find();
  return res
    .status(200)
    .json(new ApiResponse(200, data, " Successfully fetched all the Promotion"));
});

export const deletePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Promotion.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updatePromotion = asyncHandler(async (req, res) => {
  const { Employee, Designation, title, promotionDate, description } = req.body;

  const { id } = req.params;

  const users1 = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Employee, Designation, title, promotionDate, description
  });

  let transporter = createTransport({
    host: "smtpout.secureserver.net",
    auth: {
      user: "info@kusheldigi.com",
      pass: "info@kushel12345"
    },
    tls: {
      rejectUnauthorized: false // Temporarily bypass certificate validation
    }
  });

  let info = await transporter.sendMail({
    from: 'Kushel Digi Solutions" <info@kusheldigi.com>',
    to: `${users1.email}`,
    subject: "Regarding Promotion",
    html: `<div>
      <div>Employee: ${Employee}</div>
      <div>Designation: ${Designation}</div>
      <div>title: ${title}</div>
      <div>Promotion Date: ${promotionDate}</div>
      <div>Description: ${description}</div>
      </div>`
  });




  console.log(`mail send to ${users1}`);

  const updatePromotion = await Promotion.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updatePromotion, "Updated  Successfully"));
});


// =========================trainer controller=================

export const createTrainer = async (req, res) => {
  try {

    const { Branch, firstName, lastName, contact, email, expertise, address } = req.body;

    // const userDetail = await User.findOne({ fullName: Employee });

    // await mailSender(userDetail.email, `Regarding Transfer`, `<div>
    //  <div>Branch By: ${branch}</div>
    //  <div>Department: ${Department}</div>
    //  <div>Employee: ${Employee}</div>
    //  <div>TransferDate: ${TransferDate}</div>
    //  <div>Description: ${Description}</div>
    //  </div>`);


    const tranerDetail = await Trainer.create({ Branch, firstName, lastName, contact, email, expertise, address });


    return res.status(200).json({
      status: true,
      message: 'Trainer created successfully',
      data: tranerDetail,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const getTrainer = async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Trainer.find({});


    return res.status(200).json({
      status: 200,
      message: "tranfer fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const deleteTrainer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Trainer.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateTrainer = asyncHandler(async (req, res) => {
  const { Branch, firstName, lastName, contact, email, expertise, address } = req.body;

  const { id } = req.params;

  // const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Branch, firstName, lastName, contact, email, expertise, address
  });

  // await mailSender(userDetail.email, `Regarding Transfer`, `<div>
  //      <div>Branch By: ${branch}</div>
  //      <div>Department: ${Department}</div>
  //      <div>Employee: ${Employee}</div>
  //      <div>TransferDate: ${TransferDate}</div>
  //      <div>Description: ${Description}</div>
  //      </div>`);


  const updateTrainer = await Trainer.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTrainer, "Updated  Successfully"));
});

// ==========================trainingList=======================

export const createTrainingList = async (req, res) => {
  try {

    const { Branch, trainerOption, trainingType, trainer, trainingCost, Employee, startDate, endDate, description } = req.body;

    const userDetail = await User.findOne({ fullName: Employee });

    await mailSender(userDetail.email, `Regarding TrainingList`, `<div>
       <div>Branch By: ${userDetail.fullName} is assigned to the trainer ${trainer} </div>
       </div>`);


    const tranerDetail = await TrainingList.create({ Branch, trainerOption, trainingType, trainer, trainingCost, Employee, startDate, endDate, description });


    return res.status(200).json({
      status: true,
      message: 'Trainer created successfully',
      data: tranerDetail,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const getTrainingList = async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await TrainingList.find({});


    return res.status(200).json({
      status: 200,
      message: "TrainingList fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const deleteTrainngList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await TrainingList.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateTrainingList = asyncHandler(async (req, res) => {
  const { Branch, trainerOption, trainingType, trainer, trainingCost, Employee, startDate, endDate, description, status, performance, remarks } = req.body;

  const { id } = req.params;

  const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Branch, trainerOption, trainingType, trainer, trainingCost, Employee, startDate, endDate, description, status, performance, remarks
  });


  await mailSender(userDetail.email, `Regarding TrainingList`, `<div>
  <div>${userDetail.fullName} is assigned to the trainer ${trainer}</div>
  </div>`);


  const updateTrainer = await TrainingList.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTrainer, "Updated  Successfully"));
});

// ==================transfer====================

export const createTransfer = asyncHandler(async (req, res) => {
  try {

    const { branch, Employee, Department, TransferDate, Description } = req.body;

    const userDetail = await User.findOne({ fullName: Employee });

    await mailSender(userDetail.email, `Regarding Transfer`, `<div>
       <div>Branch By: ${branch}</div>
       <div>Department: ${Department}</div>
       <div>Employee: ${Employee}</div>
       <div>TransferDate: ${TransferDate}</div>
       <div>Description: ${Description}</div>
       </div>`);


    const tranferDetail = await Transfer.create({ Employee, branch: branch, Department: Department, TransferDate: TransferDate, Description: Description });


    return res.status(200).json({
      status: true,
      message: 'Notification created successfully',
      data: tranferDetail,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})


export const getTransfer = asyncHandler(async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Transfer.find({}).populate("Employee");


    return res.status(200).json({
      status: 200,
      message: "tranfer fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const deleteTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Transfer.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateTransfer = asyncHandler(async (req, res) => {
  const { branch, Employee, Department, TransferDate, Description } = req.body;

  const { id } = req.params;

  const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    branch, Employee, Department, TransferDate, Description
  });

  await mailSender(userDetail.email, `Regarding Transfer`, `<div>
       <div>Branch By: ${branch}</div>
       <div>Department: ${Department}</div>
       <div>Employee: ${Employee}</div>
       <div>TransferDate: ${TransferDate}</div>
       <div>Description: ${Description}</div>
       </div>`);


  const updateTransfer = await Transfer.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTransfer, "Updated  Successfully"));
});

// =====================holiday controller=============
export const createHoliday = asyncHandler(async (req, res) => {
  try {

    const { holidayName, startDate, endDate } = req.body;

    const users = await User.find({});

    //  Extract email addresses from the retrieved user 
    const emailList = users.map(user => user.email);

    for (const email of emailList) {
      // await SendEmail(email);
      await mailSender(email, `Regarding Holiday`, `<div>
       <div>Holiday: ${holidayName}</div>
       <div>Start Date: ${startDate}</div>
       <div>endDate: ${endDate}</div>
       </div>`);
      console.log(`Email sent to ${email}`);
    }

    const holiday = await Holiday.create({ holidayName, startDate, endDate });


    return res.status(200).json({
      status: true,
      message: 'Holiday created successfully',
      data: holiday,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const getHoliday = asyncHandler(async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Holiday.find({});


    return res.status(200).json({
      status: 200,
      message: "tranfer fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const deleteHoliday = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Holiday.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateHoliday = asyncHandler(async (req, res) => {
  const { holidayName, startDate, endDate } = req.body;

  const { id } = req.params;

  let updateObj = removeUndefined({
    holidayName, startDate, endDate
  });

  const users = await User.find({});

  //  Extract email addresses from the retrieved user 
  const emailList = users.map(user => user.email);

  for (const email of emailList) {
    // await SendEmail(email);
    await mailSender(email, `Regarding Holiday`, `<div>
     <div>Holiday: ${holidayName}</div>
     <div>Start Date: ${startDate}</div>
     <div>endDate: ${endDate}</div>
     </div>`);
    console.log(`Email sent to ${email}`);
  }

  const updateHoliday = await Holiday.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateHoliday, "Updated  Successfully"));
});

// ============================== trip controller==================

export const createTrip = asyncHandler(async (req, res) => {
  try {

    const { Employee, startDate, endDate, purpose, country, description } = req.body;

    const userDetail = await User.findOne({ fullName: Employee });

    await mailSender(userDetail.email, `Regarding Trip`, `<div>
       <div>Employee: ${Employee}</div>
       <div>StartDate: ${startDate}</div>
       <div>EndDate: ${endDate}</div>
       <div>Purpose: ${purpose}</div>
       <div>Country: ${country}</div>
       <div>Description: ${description}</div>
       </div>`);


    const tranferDetail = await Trip.create({ Employee, startDate, endDate, purpose, country, description });


    return res.status(200).json({
      status: true,
      message: 'Trip created successfully',
      data: tranferDetail,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const getTrip = asyncHandler(async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Trip.find();


    return res.status(200).json({
      status: 200,
      message: "Trip fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Trip.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateTrip = asyncHandler(async (req, res) => {
  const { Employee, startDate, endDate, purpose, country, description } = req.body;

  const { id } = req.params;

  const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    Employee, startDate, endDate, purpose, country, description
  });

  await mailSender(userDetail.email, `Regarding Trip`, `<div>
  <div>Employee: ${Employee}</div>
  <div>StartDate: ${startDate}</div>
  <div>EndDate: ${endDate}</div>
  <div>Purpose: ${purpose}</div>
  <div>Country: ${country}</div>
  <div>Description: ${description}</div>
  </div>`);


  const updateTransfer = await Trip.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateTransfer, "Updated  Successfully"));
});

// ============= lead backend start==========

export const createLeads = asyncHandler(async (req, res) => {
  try {

    const { } = req.body;
    const tranferDetail = await Lead.create({});

    return res.status(200).json({
      status: true,
      message: 'Lead created successfully',
      data: tranferDetail,
    });

  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const getLeads = asyncHandler(async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Lead.find();


    return res.status(200).json({
      status: 200,
      message: "Lead fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
})

export const deleteLeads = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Lead.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const closeLead = async (req, res) => {
  const { id } = req.params; 

  try {
    const currentDate = new Date().toISOString(); 
    
    const lead = await Lead.findByIdAndUpdate(id, {
      status: 'Close',
      closeDate: currentDate,
    }, { new: true }); 

    if (!lead) {
      return res.status(404).json({ status:false, message: 'Lead not found' });
    }

    return res.status(200).json({
      status:true ,
      lead
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllCloseLead = async (req, res) => {

  try {

   const  ans = await Lead.find({status:"Close"}).sort({Date:-1});
   return res.status(200).json({
    status:ans , 
    
   })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllCloseLead2 = async (req, res) => {
  
  const {id} =req.body;

  try {

   const  ans = await Lead.find({status:"Close" , LeadOwner:id}).sort({Date:-1});
   return res.status(200).json({
    status:ans , 
   })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getTodayLead = async (req, res) => {
  try {
    // Get the current date in UTC for the start of the day
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Get the end of the current day in UTC
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const ans = await Lead.find({
      createAt: { $gte: startOfToday, $lte: endOfToday }
    });

    return res.status(200).json({
      status: "success",
      leads: ans,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getTodayLead2 = async (req, res) => {
  try {
    const {id} = req.body;
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const ans = await Lead.find({
      createAt: { $gte: startOfToday, $lte: endOfToday } , 
      LeadOwner: id
    });

    return res.status(200).json({
      status: "success",
      leads: ans,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const updateLeads = asyncHandler(async (req, res) => {
  const { LeadOwner,
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
    DescriptionInfo } = req.body;

  const { id } = req.params;

  // const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    LeadOwner,
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
    DescriptionInfo
  });




  const updateLead = await Lead.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateLead, "Updated  Successfully"));
});

export const updateLeadImage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { image } = req.files;

    const details = await uploadToCloudinary(image.tempFilePath);

    const updateLead = await Lead.findByIdAndUpdate(
      id,
      { profileImage: details.secure_url }, // Assuming 'profileImage' is the field in the User schema
      { new: true } // To return the updated document after the update operation
    );


    return res
      .status(200)
      .json(new ApiResponse(200, updateLead, "Updated Lead image Details Successfully"));
  } catch (error) {
    console.log("error is ", error.message);
    throw new ApiError(error.status || 500, "internal server error");
  }
});


// ===================invoice backend=============

export const createInvoice = async (req, res) => {
  try {

    const { User, InvoiceNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency, leadId } = req.body;

    const createIn = await Invoice.create({ User, InvoiceNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency, ts: new Date().getTime(), });


    const leadDetails = await Lead.findById(leadId);

    // Add the invoice ID to the lead's invoiceId array
    leadDetails.invoiceId.push(createIn._id);

    // Save the updated lead document
    await leadDetails.save();





    return res.status(200).json({
      status: true,
      message: 'Invoice created successfully',
      data: createIn,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const getInvoice = async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const transfer = await Invoice.find({});

    return res.status(200).json({
      status: 200,
      message: "tranfer fetched successfully",
      data: transfer
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Invoice.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const { InvoiceNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency } = req.body;

  // const { id } = req.params;
  const id = req.params.id;

  // const userDetail = await User.findOne({ fullName: Employee });

  // let updateObj = removeUndefined(id,{
  //   InvoiceNo,GstNo,SacCode, PlacedSupply,BillTo,ShipTo,ClientName,Address,Mobile,Email,ItemDescription,Qty,Price, Amount,BalanceAmount,Note,currency
  // });


  const updateInvoice = await Invoice.findByIdAndUpdate(
    id,
    // {
    //   $set: updateObj,
    // },
    {
      InvoiceNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency
    },

    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateInvoice, "Updated  Successfully"));
});

export const getEveryLeadInvoice = asyncHandler(async (req, res) => {

  const lens1 = await Lead.findById(req.params.id).populate("invoiceId");


  let lens = lens1?.invoiceId;


  res.json({
    data: lens,
    status: true,
    message: "successfully get everyUser"
  })
});

// ======================quatation backend==============
export const createQuatation = async (req, res) => {
  try {

    const { User, QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency, leadId } = req.body;



    const createQ = await Quatation.create({ User, QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency, ts: new Date().getTime(), });


    const leadDetails = await Lead.findById(leadId);

    // add the quotation id to the leadDetails created by the user
    leadDetails.quatationId.push(createQ._id);

    // Save the updated lead document in the quotation
    await leadDetails.save();


    return res.status(200).json({
      status: true,
      message: 'Quatation created successfully',
      data: createQ,
    });


  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}
export const getQuatation = async (req, res) => {
  try {

    // Find notifications where the user ID is in the user array
    const quatation = await Quatation.find({});

    return res.status(200).json({
      status: 200,
      message: "tranfer fetched successfully",
      data: quatation
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}
export const deleteQuatation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Quatation.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Deleted Successfully"));
});
export const updateQuatation = asyncHandler(async (req, res) => {
  const { QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency } = req.body;

  // const { id } = req.params;
  const id = req.params.id;


  // const userDetail = await User.findOne({ fullName: Employee });

  // let updateObj = removeUndefined(id,{
  //   InvoiceNo,GstNo,SacCode, PlacedSupply,BillTo,ShipTo,ClientName,Address,Mobile,Email,ItemDescription,Qty,Price, Amount,BalanceAmount,Note,currency
  // });


  const updateQuatation = await Quatation.findByIdAndUpdate(
    id,
    // {
    //   $set: updateObj,
    // },
    {
      QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency
    },

    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updateQuatation, "Updated  Successfully"));
});
export const getEveryLeadQuatation = asyncHandler(async (req, res) => {

  const lens1 = await Lead.findById(req.params.id).populate("quatationId");


  let lens = lens1?.quatationId;


  res.json({
    data: lens,
    status: true,
    message: "successfully get everyUser"
  })
});

export const EveryUserLeadSomething = async (req, res) => {
  try {
    const { QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency } = req.body;

    const id = req.params.id;


    const detailsSomething = await Lead.findById({ id });



    const createDetails = await Quatation.create({
      QuatationNo, GstNo, SacCode, PlacedSupply, BillTo, ShipTo, ClientName, Address, Mobile, Email, ItemDescription, Qty, Price, Amount, BalanceAmount, Note, currency
    });

    createDetails.PlacedSupply(detailsSomething);

    return ({
      data: createDetails,
      message: "Create details Page successfully",
      status: true
    })

  }
  catch (error) {
    console.log(error);
  }
}
// ======================quatation backend end=================

// =========================Employee salary api=================

export const SetSallary = async (req, res) => {
  try {

    const { salary, paySlipType } = req.body;


    const createSallary = await Salary.create({ salary, paySlipType });


    return res.status(200).json({
      status: true,
      message: 'salary created successfully',
      data: createSallary,
    });



  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const getSallary = async (req, res,) => {
  try {

    // Find notifications where the user ID is in the user array
    const tosting = await Salary.find({}).populate("user")


    return res.status(200).json({
      status: 200,
      message: "Sallary fetched successfully",
      data: tosting
    });



  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}

export const updateSalary = asyncHandler(async (req, res) => {
  const { salary, paySlipType } = req.body;

  const { id } = req.params;

  // const userDetail = await User.findOne({ fullName: Employee });

  let updateObj = removeUndefined({
    salary, paySlipType
  });


  const updateInvoice = await Salary.findByIdAndUpdate(
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
    .json(new ApiResponse(200, updateInvoice, "Updated  Successfully"));
});

export const syncUser = async (req, res) => {
  const { id } = req.params;

  const userListWithSync = await User.find({ documentPermission: id });
  userListWithSync.userId = req.params;


  const ans = await Leave.$where({ userListWithSync });

  return ({
    data: ans,
    message: "document permission is successfully given to the user",
  })

}