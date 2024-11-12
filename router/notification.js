import { Router } from "express";
import {createNotification , getNotification , deleteNotification , getNotificationHR} from "../controller/notification.js"

const router = Router();

router.post('/createNotification',createNotification);
router.get('/getNotification/:userId',getNotification);
router.get('/getNotification',getNotificationHR);
router.delete('/deleteNotification/:userId/:notId',deleteNotification);

export default router;
