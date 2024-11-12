import { Router } from "express";

import isAuthenticated from "../middleware/auth.js";
import {
  deleteTask,
  getTasks,
  postTask,
  updateTask,

} from "../controller/TaskController.js";
import { CreateClient, EditClient  ,  getProjectTask , getMyProjectTask ,getAllClient ,getTaskByUserProject ,  DisableClient , CreateProject , EditProject , changeTaskStatus , getAllProject  , delteTaskId, DeleteProjects , getProjectByUser , CreateProjectTask ,EditProjectTask ,  GetAllTask , GetTaskByUser , getTodayBirthday  } from "../controller/Clients.js";

import {ProjectTimerCreate} from "../controller/ProjectTimer.js"

const router = Router();

router.post("/postTask", isAuthenticated, postTask);

router.put("/updateTask/:id", isAuthenticated, updateTask);

router.get("/getTasks", isAuthenticated, getTasks);

router.delete("/deleteTask/:id", isAuthenticated, deleteTask);

router.delete("/deleteProjectTaskapi/:id" , delteTaskId);


// for cliient 
router.post("/createClient" , CreateClient);
router.post("/editClient/:clientId" , EditClient);
router.get("/getAllClient" , getAllClient);
router.post("/disableClient/:clientId" , DisableClient);

// for projeccts 

router.post("/createProject" , CreateProject);
router.post("/editProject/:projectId" , EditProject);
router.get("/getAllProject" , getAllProject);
router.delete("/deleteProject/:projectId" , DeleteProjects);
router.get("/getProjectByUser/:userId" , getProjectByUser);


// for project task 
router.post("/createProjectTask/:projectId" , CreateProjectTask);
router.post("/editProjectTask/:projectId/:taskId" , EditProjectTask);
router.post("/changeTaskStatus/:taskId" , changeTaskStatus);
router.get("/getAllTask" , GetAllTask);
router.get("/getTaskByUser/:userId" ,GetTaskByUser);
router.get("/getTaskByUserProject/:userId/:projectId" ,getTaskByUserProject);
router.get("/getProjectTask/:projectId" ,getProjectTask);
router.get("/getMyProjectTask/:projectId/:memberId" ,getMyProjectTask);

// task timer apis 
router.post("/postProjectTimer" , ProjectTimerCreate);


// user get birthday 
router.get("/getBirthDayUser" , getTodayBirthday);



export default router;
