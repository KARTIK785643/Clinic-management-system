import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new doctor (self-registration)
// @route   POST /api/doctors/register
// @access  Public
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, gender, speciality } = req.body;

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ success: false, message: 'Doctor already exists with this email' });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      phone: phone || '0000000000',
      gender: gender || 'Not Selected',
      speciality: speciality || 'General physician',
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select('-password -slots_booked');
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth doctor & get token
// @route   POST /api/doctors/login
// @access  Public
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (doctor && (await doctor.matchPassword(password))) {
      res.json({
        success: true,
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor)
export const doctorAppointments = async (req, res) => {
    try {
        const docId = req.doctor._id;
        const appointments = await Appointment.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Appointment Status (Complete / Cancel)
// @route   POST /api/doctors/update-status
// @access  Private (Doctor)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body; // status can be 'completed' or 'cancelled'
        const docId = req.doctor._id;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.docId.toString() !== docId.toString()) {
            return res.status(401).json({ success: false, message: 'Unauthorized action' });
        }

        if (status === 'completed') {
            await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true, status: 'completed' });
            return res.json({ success: true, message: 'Appointment Completed' });
        } else if (status === 'cancelled') {
            await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true, status: 'cancelled' });

            // release slot
            const { slotDate, slotTime } = appointment;
            const doctorData = await Doctor.findById(docId);

            let slots_booked = doctorData.slots_booked;
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

            await Doctor.findByIdAndUpdate(docId, { slots_booked });

            return res.json({ success: true, message: 'Appointment Cancelled' });
        }

        res.status(400).json({ success: false, message: 'Invalid status' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
