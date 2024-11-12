import User from "../models/User/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { SendEmail } from "../utils/SendEmail.js";
import ActivityTracker from "../models/ActivityTracker/ActivityTracker.js";
import crypto from "crypto";
import fs from "fs";
import { removeUndefined } from "../utils/util.js";
import Leave from "../models/Leave/Leave.js";

const generateRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = await user.generateAuthToken();

    return token;
  } catch (error) {
    // Log the actual error for debugging purposes
    console.error("Error in generateRefreshToken:", error.message);

    throw new ApiError(500, "Something went wrong");
  }
};

 export const uploadImgToCloudinary = asyncHandler(async(req ,res)=>{

  const {image}  = req.files;
  
   const details = await uploadToCloudinary(image.tempFilePath);

   return res.status(200).json({
    status:true , 
    data: details.secure_url
   })

})

export const getUserOwndetail = async(req ,res)=>{
   const {userId} = req.params;
   const userDetail = await User.findById(userId).populate("PermissionRole");

   return res.status(200).json({
    status:true , 
    data:userDetail
   })
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getThisMonthLeave = async (req, res) => {
  try {
    const { userId } = req.params;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const formattedStartOfMonth = formatDate(startOfMonth);

    const leaves = await Leave.find({
      user: userId,
      from: { $gt: formattedStartOfMonth },
      status:'Accepted'
    });
    
    return res.status(200).json({
      status: true,
      totalDays:leaves.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const RegisterUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    email,
    image,
    email1,
    password,
    gmail,
    department,
    designation,
    joiningDate,
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
  } = req.body;

  if (
    [
      fullName,
      mobile,
      email,
      image,
      email1,
      password,
      gmail,
      department,
      designation,
      joiningDate,
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
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({
      success: false,
      message: "User Already Exists",
    });
  }

  const UserAvatarLocalPath = req.file?.path;

  if (!UserAvatarLocalPath) {
    throw new ApiError(400, "Avatar local path is required");
  }

  const avatar = await uploadToCloudinary(UserAvatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error uploading avatar to Cloudinary");
  }

  const user = await User.create({
    fullName,
    mobile,
    email,
    image,
    email1,
    password,
    gmail,
    department,
    designation,
    joiningDate,
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
    profileImage: avatar?.url,
  });

  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = await generateRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select("-password ");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("token", token, options).json(
    new ApiResponse(
      200,
      {
        user: loggedUser,
        token,
      },
      "User is successfully logged in"
    )
  );
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User is not found");
  }
  const resetToken = await user.generateResetToken();
  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  const message = `click on the link to reset your password . ${url}`;

  await SendEmail(user.email, "Reset Password", message);

  res
    .status(200)
    .json(new ApiResponse(200, `Reset Token is sent to ${user.email}`));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.save();
  res.status(200).json(new ApiResponse(200, "Password resets successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  if (newpassword !== confirmpassword) {
    throw new ApiError(401, "New passwords do not match");
  }
  const user = await User.findById(req.user._id);

  const passwordcheck = await user.isPasswordCorrect(oldpassword);
  if (!passwordcheck) {
    throw new ApiError(401, "invalid User Old Password");
  }
  user.password = newpassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully Password Changed"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      email1,
      password,
      gmail,
      department,
      designation,
      joiningDate,
      pan,
      adhar,
      father,
      currentAddress,
      currentState,
      currentCity,
      qualification,
      currentPin,
      residence,
      perState,
      perCity,
      perPin,
      Martial,
      nationality,
      Mother,
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
      image , 
      dob
    } = req.body;



    const obj = removeUndefined({
      fullName,
      mobile,
      email,
      // profileImage: profileImage?.url,
      email1,
      password,
      gmail,
      department,
      designation,
      joiningDate,
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
      SalaryPay,
      Jobdescription,
      BeneficiaryName,
      SalaryBankName,
      BankIfsc,
      AccountNumber,
      confirmAccount,
      Branch ,
      updateProfile: false,  
       dob , 
      
      
    });
    const user = await User.findByIdAndUpdate(req.user._id, obj, {
      new: true,
    }).select("-password").populate("PermissionRole");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Updated User Details Successfully"));
  } catch (error) {
    console.log("error is ", error.message);
    throw new ApiError(error.status || 500, "internal server error");
  }
});
export const updateProfileImage = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
 
    const {image}  = req.files;

      const details = await uploadToCloudinary(image.tempFilePath);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profileImage: details.secure_url }, // Assuming 'profileImage' is the field in the User schema
      { new: true } // To return the updated document after the update operation
    );

           
     console.log("a ",updatedUser);
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Updated User Details Successfully"));
  } catch (error) {
    console.log("error is ", error.message);
    throw new ApiError(error.status || 500, "internal server error");
  }
});

export const UpdateUser = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      department,
      employeeId,
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
      PermissionRole
    } = req.body;
    const { userId } = req.params;


    // const profileImageLocalPath = req.file?.path;
    // if (!profileImageLocalPath) {
    //   throw new ApiError(401, "avatar file is Missing");
    // }
    // const profileImage = await uploadToCloudinary(profileImageLocalPath);
    // if (!profileImage.url) {
    //   throw new ApiError(400, "error uploading on cloudinary");
    // }

    const updateObj = removeUndefined({
      fullName,
      // profileImage: profileImage?.url,
      department,
      employeeId,
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
      role: department !== "Hr" ? "EMPLOYEE" : "HR",
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
      PermissionRole: PermissionRole === "Select Role" ? null : PermissionRole
    });


    
    const user = await User.findByIdAndUpdate(userId, updateObj, {
      new: true,
    }).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Updated User Details Successfully"));
  } catch (error) {
    console.log("error is ", error.message);
    throw new ApiError(error.status || 500, "internal server error");
  }
});

export const UserProfile = asyncHandler(async (req, res) => {
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

export const getUsers = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  let data;

  if (!userId || userId === "undefined" || userId === "") {
    data = await User.find({});
  } else {
    data = await User.findById(userId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Successfully feteched all Users"));
});

export const getUserByid = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password ");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        UserDetails: user,
      },
      "User details fetched successfully"
    )
  );
});

export const DeleteUserProfile = asyncHandler(async (req, res) => {
  const user = req.user._id;
  await User.findByIdAndDelete(user);
  return res.status(200).json(new ApiResponse(200, {}, "successfully deleted"));
});

export const DeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id)
  return res.status(200).json(new ApiResponse(200, {}, "successfully deleted"));
});




export const deleteUsers = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully deleted all users"));
});

//! check this 
export const getActiveUsers = asyncHandler(async (req, res) => {

  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

  const activeUsers = await ActivityTracker.find({
    clockOut: '0',
    clockIn: { $gte: twelveHoursAgo.getTime() } 
  }).populate("user");

  return res.status(200).json(new ApiResponse(200, activeUsers, "Active users fetched successfully"));
});

export const changeBreakIn = async(req ,res)=>{
    const {isBreakIn , userId} = req.body;
    console.log("is",isBreakIn , userId);
      const userDetail = await User.findById(userId);
       userDetail.isBreakIn = isBreakIn;
        await userDetail.save();

        return res.status(200).json({
          status:true ,
          
        })
}

export const getActiveUsersCount = asyncHandler(async (req, res) => {
  // Get the current timestamp in milliseconds
  const currentDateTimestamp = new Date().getTime();

  // Calculate timestamp for 12 hours before the current time
  const twelveHoursAgoTimestamp = currentDateTimestamp - (12 * 60 * 60 * 1000); // 12 hours * 60 minutes * 60 seconds * 1000 milliseconds

  try {
    // Query the ActivityTracker collection to find active users within the specified range
    const activeUsers = await ActivityTracker.find({
      // Query activities within the 12-hour range
      clockIn: { $gte: twelveHoursAgoTimestamp, $lte: currentDateTimestamp },
      // Exclude entries where clockOut is not '0' or is not present
      $or: [{ clockOut: '0' }, { clockOut: { $exists: false } }]
    });


    // Return the count of active users as a JSON response
    return res.status(200).json(new ApiResponse(200, activeUsers.length, "Active Users count fetched successfully"));
  } catch (error) {
    console.error("Error fetching active users:", error);
    // Return an error response if there's a problem with the query
    return res.status(500).json(new ApiResponse(500, null, "Error fetching active users"));
  }
});



// till this 

const forgetPassword1 = async ({ email, otp }) => {
  // todo
  let checkUser = await User.findOne({ email });
  if (!checkUser) {
    return { success: false, message: "Invalid Email" };
  }

  let otp1 = fs.readFileSync(`./otp/otp-${email}.txt`, "utf-8");
  console.log(otp1);
  if (Number(otp1) !== Number(otp)) {
    return { success: false, message: "Invalid OTP" };
  }

  return { success: true, message: "Otp matched successfully", email };
};

const forgetPassword2 = async ({ email, password }) => {
  // todo
  let checkUser = await User.findOne({ email });
  if (!checkUser) {
    return { success: false, message: "Invalid Email" };
  }

  // password = await bcrypt.hash(password, 7);
  // console.log(password);
  await User.findByIdAndUpdate(
    checkUser._id,
    { $set: { password } },
    { new: true }
  );

  return { success: true, message: "Password reset successfully" };
};

export const getEmployeesByEmployee = asyncHandler(async (req, res) => {
  const data = await User.find({ hr: req.user.hr, _id: { $ne: req.user._id } });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "data  fetched successfully"));
});

export const uploadDocuments = async (req, res) => {
  const { id } = req.params;

  const {
    adharCard,
    pancard,
    tenCert,
    twevelCert,
    cancelCheque,
    LastOrganization,
    RelievingLetter,
    OfferLetter,
    ExperienceLetter , 
    ITR ,
    ITR2
  } = req.files;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const documentsToUpdate = [
      { name: 'adharCard', file: adharCard },
      { name: 'pancard', file: pancard },
      { name: 'tenCert', file: tenCert },
      { name: 'twevelCert', file: twevelCert },
      { name: 'cancelCheque', file: cancelCheque },
      { name: 'LastOrganization', file: LastOrganization },
      { name: 'RelievingLetter', file: RelievingLetter },
      { name: 'OfferLetter', file: OfferLetter },
      { name: 'ExperienceLetter', file: ExperienceLetter } ,
      { name: 'ITR', file: ITR } , 
      {name: 'ITR2' , file:ITR2}
    ];

    let updatedDocuments = user.document || [];

    for (let doc of documentsToUpdate) {
      if (doc.file) {
        const details = await uploadToCloudinary(doc.file.tempFilePath);

        // Check if the document already exists
        const existingDocIndex = updatedDocuments.findIndex(d => d.name === doc.name);

        if (existingDocIndex >= 0) {
          // Update the existing document's URL
          updatedDocuments[existingDocIndex].url = details.secure_url;
        } else {
          // Add a new document entry
          updatedDocuments.push({ name: doc.name, url: details.secure_url });
        }
      }
    }

    // Save the updated documents to the user schema
    user.documents = updatedDocuments;
    await user.save();

    res.status(200).json({ message: 'Documents uploaded successfully', documents: user.documents });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading documents' });
  }
};

export const uploadSingleImg = async (req, res) => {

  const { Image } = req.files;

  try {
   
        const details = await uploadToCloudinary(Image.tempFilePath);

    res.status(200).json({ status:true , message: 'Documents uploaded successfully', link:details.secure_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading documents' });
  }
};

export const DeactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
 return res.status(404).json({
  status:false ,
  message:"User do not exist "
 })
  }

  const newDeactivationStatus = user.isDeactivated === "Yes" ? "No" : "Yes";

  user.isDeactivated = newDeactivationStatus;
  
  await user.save();

  return res.status(200).json({
      status:true ,
   message:`Account successfully ${newDeactivationStatus === "Yes" ? "deactivated" : "activated"}`
})

})