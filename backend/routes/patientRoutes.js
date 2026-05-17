import express from 'express';
import {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
} from '../controllers/patientController.js';
import { protectPatient } from '../middleware/authMiddleware.js';

const routerInstance = express.Router();


routerInstance.post('/register', registerPatient);
routerInstance.post('/login', loginPatient);
routerInstance.get('/profile', protectPatient, getPatientProfile);
routerInstance.put('/profile', protectPatient, updatePatientProfile);
routerInstance.post('/book-appointment', protectPatient, bookAppointment);
routerInstance.get('/appointments', protectPatient, listAppointments);
routerInstance.post('/cancel-appointment', protectPatient, cancelAppointment);

export default routerInstance;
