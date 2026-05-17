import jwt from 'jsonwebtoken';
import Patient from '../models/patientModel.js';
import Doctor from '../models/doctorModel.js';

// ─── Patient Auth Middleware ──────────────────────────────
export const protectPatient = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const patient = await Patient.findById(decoded.id).select('-password');
    if (!patient) {
      return res.status(401).json({ success: false, message: 'Patient not found' });
    }

    req.patient = patient;
    next();
  } catch (error) {
    console.error('protectPatient error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

// ─── Doctor Auth Middleware ───────────────────────────────
export const protectDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select('-password');
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Doctor not found' });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error('protectDoctor error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

// ─── Admin Auth Middleware ────────────────────────────────
export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Not authorized as admin' });
    }

    next();
  } catch (error) {
    console.error('protectAdmin error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};
