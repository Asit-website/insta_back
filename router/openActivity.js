import { Router } from "express";
import {CreateTask , EditTask , DeleteTask, CreateMeet , EditMeet  , DeleteMeet , GetTaskByUser , GetMeetByUser , FetchFollow} from "../controller/openActivity.js"

const router = Router();

router.post("/createTask" , CreateTask);
router.post("/editTask/:taskId" , EditTask);
router.delete("/deleteTask/:taskId" , DeleteTask);
router.get("/getTaskByUser/:userId" , GetTaskByUser);

router.get("/fetchFollow/:id" , FetchFollow);


router.post("/createMeet" , CreateMeet);
router.post("/editMeet/:meetId" , EditMeet);
router.delete("/deleteMeet/:meetId" , DeleteMeet);
router.get("/getMeetByUser/:userId" , GetMeetByUser);



export default router;
