import express from 'express';
import { getMyToken, getDoctorQueue, callNextPatient } from '../controllers/queueController.js';
import { protectPatient, protectDoctor } from '../middleware/authMiddleware.js';

const routerInstance = express.Router();

routerInstance.get('/my-token', protectPatient, getMyToken);
routerInstance.get('/doctor', protectDoctor, getDoctorQueue);
routerInstance.post('/call-next', protectDoctor, callNextPatient);

export default routerInstance;
