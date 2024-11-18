import { Router } from "express";
import {
  postLeaveType,
  updateLeaveType,
  getLeaveTypes,
  deleteLeaveType,
  getDesignation,
  deleteDesignation,
  getDesignations,
  postDesignation,
  updateDesignation,
  fetchAllDocs,
  deleteDepartment,
  getDepartments,
  postDepartment,
  updateDepartment,

  deleteBranch,
  getBranchs,
  postBranch,
  updateBranch,
  getEmployess ,
  createDocSetup , 
  updateDocSetup , 
  deleteDocSetup,
  postLeadSource,
  updateLeadSources,
  getLeadSources,
  deleteLeadSource,
  postIndustry,
  updateIndustry,
  getIndustry,
  deleteIndustry,
  PostLeadStat,
  updateLeadStat,
  getLeadStat,
  deleteLeadStat,
  PostFollow,
  updateFollow,
  getFollow,
  deleteFollow,
  postLeadType,
  getLeadType,
  updateLeadType,
  deleteLeadType
} from "../controller/systemController.js";

const router = Router();

router.post("/postLeaveType", postLeaveType);

router.put("/updateLeaveType/:id", updateLeaveType);

router.get("/getLeaveTypes", getLeaveTypes);

router.delete("/deleteLeaveType/:id", deleteLeaveType);

router.post("/postBranch", postBranch);

router.put("/updateBranch/:id", updateBranch);

router.get("/getBranchs", getBranchs);

router.delete("/deleteBranch/:id", deleteBranch);

router.post("/postDepartment", postDepartment);

router.put("/updateDepartment/:id", updateDepartment);

router.get("/getDepartments", getDepartments);

router.delete("/deleteDepartment/:id", deleteDepartment);

router.post("/postDesignation", postDesignation);

router.put("/updateDesignation/:id", updateDesignation);

router.get("/getDesignations/:id", getDesignations);
router.get("/getEmployeess/:id",getEmployess);
router.get("/getDesignation", getDesignation);

router.delete("/deleteDesignation/:id", deleteDesignation);

router.post("/createDocSetup" , createDocSetup);
router.post("/updateDocSetup/:id" , updateDocSetup);
router.delete("/deleteDocSetup/:id" , deleteDocSetup);
router.get("/fetchAllDocs" , fetchAllDocs);

router.post("/postLeadSource", postLeadSource);
router.put("/updateLeadSource/:id", updateLeadSources);
router.get("/getLeadSource", getLeadSources);
router.delete("/deleteLeadSource/:id", deleteLeadSource);

router.post("/postIndustry", postIndustry);
router.put("/updateIndustry/:id", updateIndustry);
router.get("/getIndustry", getIndustry);
router.delete("/deleteIndustry/:id", deleteIndustry);

router.post("/postLeadStat", PostLeadStat);
router.put("/updateLeadStat/:id", updateLeadStat);
router.get("/getLeadStat", getLeadStat);
router.delete("/deleteLeadStat/:id", deleteLeadStat);

router.post("/postLeadType", postLeadType);
router.put("/updateLeadType/:id", updateLeadType);
router.get("/getLeadType", getLeadType);
router.delete("/deleteLeadType/:id", deleteLeadType);

router.post("/postFollow", PostFollow);
router.put("/updateFollow/:id", updateFollow);
router.get("/getFollow", getFollow);
router.delete("/deleteFollow/:id", deleteFollow);





export default router;
