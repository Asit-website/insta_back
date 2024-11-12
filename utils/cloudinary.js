import { unlinkSync } from "fs";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: "dt2lhechn",
  api_key: "242838256114175",
  api_secret: "I6W-rU3gSh4rOAy62ApP1Z4sW3g",
});



export const uploadToCloudinary = async (localpath) => {
  try {
    if (!localpath) return null;
    const responce = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    unlinkSync(localpath);
    // console.log("response", responce); for debugging purpose
    return responce;
  } catch (error) {
    console.log("error is encountered ", error.message);
    unlinkSync(localpath);
    return { message: "Fail" };
  }
};
