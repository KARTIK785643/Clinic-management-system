import Patient from '../models/patientModel.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, address } = req.body;

    const patientExists = await Patient.findOne({ email });

    if (patientExists) {
      return res.status(400).json({ success: false, message: 'Patient already exists' });
    }

    const patient = await Patient.create({
      name,
      email,
      password,
      phone,
      dob,
      gender,
      address,
    });

    if (patient) {
      res.status(201).json({
        success: true,
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        token: generateToken(patient._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid patient data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth patient & get token
// @route   POST /api/patients/login
// @access  Public
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (patient && (await patient.matchPassword(password))) {
      res.json({
        success: true,
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        token: generateToken(patient._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    if (patient) {
      res.json({
        success: true,
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        image: patient.image,
        address: patient.address,
        gender: patient.gender,
        dob: patient.dob,
      });
    } else {
      res.status(404).json({ success: false, message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private
export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    if (patient) {
      patient.name = req.body.name || patient.name;
      patient.phone = req.body.phone || patient.phone;
      patient.address = req.body.address || patient.address;
      patient.gender = req.body.gender || patient.gender;
      patient.dob = req.body.dob || patient.dob;
      if (req.body.image) {
        patient.image = req.body.image;
      }
      
      const updatedPatient = await patient.save();

      res.json({
        success: true,
        _id: updatedPatient._id,
        name: updatedPatient.name,
        email: updatedPatient.email,
        phone: updatedPatient.phone,
        address: updatedPatient.address,
        gender: updatedPatient.gender,
        dob: updatedPatient.dob,
        image: updatedPatient.image,
        token: generateToken(updatedPatient._id),
      });
    } else {
      res.status(404).json({ success: false, message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book appointment
// @route   POST /api/patients/book-appointment
// @access  Private
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const patientId = req.patient._id;

    const docData = await Doctor.findById(docId).select('-password');
    if (!docData) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (!docData.available) {
        return res.status(400).json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = docData.slots_booked;

    // Check for slot availability
    if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
            return res.status(400).json({ success: false, message: 'Slot not available' });
        } else {
            slots_booked[slotDate].push(slotTime);
        }
    } else {
        slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);
    }

    const patientData = await Patient.findById(patientId).select('-password');

    // Get the next token number for this doctor and date
    const existingAppointments = await Appointment.find({ docId, slotDate });
    const tokenNumber = existingAppointments.length + 1;

    const appointmentData = {
        patientId,
        docId,
        patientData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
        status: 'waiting',
        tokenNumber,
    }

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    // Update doctor's slots_booked
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: 'Appointment Booked',
      tokenNumber,
      appointmentId: newAppointment._id,
      slotDate,
      slotTime,
      doctorName: docData.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/appointments
// @access  Private
export const listAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find({ patientId: req.patient._id })
        .sort({ createdAt: -1 });
      res.json({ success: true, appointments });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment
// @route   POST /api/patients/cancel-appointment
// @access  Private
export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const patientId = req.patient._id;

        const appointmentData = await Appointment.findById(appointmentId);

        // Verify appointment patient
        if (appointmentData.patientId.toString() !== patientId.toString()) {
            return res.status(401).json({ success: false, message: 'Unauthorized action' });
        }

        await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true, status: 'cancelled' });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await Doctor.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await Doctor.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
