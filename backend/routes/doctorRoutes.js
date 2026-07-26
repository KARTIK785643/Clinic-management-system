import express from 'express';
import {
  registerDoctor,
  getDoctors,
  loginDoctor,
  doctorAppointments,
  updateAppointmentStatus
} from '../controllers/doctorController.js';
import { protectDoctor } from '../middleware/authMiddleware.js';
//for both
const routerInstance = express.Router();

routerInstance.post('/register', registerDoctor);
routerInstance.get('/', getDoctors);
routerInstance.post('/login', loginDoctor);
routerInstance.get('/appointments', protectDoctor, doctorAppointments);
routerInstance.post('/update-status', protectDoctor, updateAppointmentStatus);

export default routerInstance;
