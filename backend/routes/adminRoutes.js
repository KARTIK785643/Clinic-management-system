import express from 'express';
import {
  adminLogin,
  addDoctor,
  getAdminDoctors,
  getAdminAppointments,
  cancelAppointmentAdmin,
  getAdminPatients,
  getAdminStats,
  deleteDoctor,
  updateDoctor
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const routerInstance = express.Router();

routerInstance.post('/login', adminLogin);
routerInstance.post('/add-doctor', protectAdmin, addDoctor);
routerInstance.get('/doctors', protectAdmin, getAdminDoctors);
routerInstance.get('/appointments', protectAdmin, getAdminAppointments);
routerInstance.post('/cancel-appointment', protectAdmin, cancelAppointmentAdmin);
routerInstance.get('/patients', protectAdmin, getAdminPatients);
routerInstance.get('/stats', protectAdmin, getAdminStats);
routerInstance.delete('/doctor/:id', protectAdmin, deleteDoctor);
routerInstance.put('/doctor/:id', protectAdmin, updateDoctor);

export default routerInstance;
