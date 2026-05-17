import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import Patient from '../models/patientModel.js';

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ success: true, token, name: 'Administrator', email });
        } else {
            res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new doctor
// @route   POST /api/admin/add-doctor
// @access  Private (Admin)
export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const image = req.body.image || ''; // image URL if handled from frontend or multer

        const doctorExists = await Doctor.findOne({ email });

        if (doctorExists) {
            return res.status(400).json({ success: false, message: 'Doctor already exists' });
        }

        const doctor = new Doctor({
            name,
            email,
            password,
            image,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now()
        });

        await doctor.save();

        res.status(201).json({ success: true, message: 'Doctor Added' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all doctors for admin
// @route   GET /api/admin/doctors
// @access  Private (Admin)
export const getAdminDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin)
export const getAdminAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel appointment
// @route   POST /api/admin/cancel-appointment
// @access  Private (Admin)
export const cancelAppointmentAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

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

// @desc    Get all users (patients)
// @route   GET /api/admin/patients
// @access  Private (Admin)
export const getAdminPatients = async (req, res) => {
    try {
        const patients = await Patient.find({}).select('-password');
        res.json({ success: true, patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get stats for dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();

        res.json({ 
            success: true, 
            stats: { totalAppointments, totalDoctors, totalPatients } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctor/:id
// @access  Private (Admin)
export const deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update doctor details
// @route   PUT /api/admin/doctor/:id
// @access  Private (Admin)
export const updateDoctor = async (req, res) => {
    try {
        const { name, phone, gender, speciality, degree, experience, about, fees, available, address } = req.body;

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        if (name !== undefined) doctor.name = name;
        if (phone !== undefined) doctor.phone = phone;
        if (gender !== undefined) doctor.gender = gender;
        if (speciality !== undefined) doctor.speciality = speciality;
        if (degree !== undefined) doctor.degree = degree;
        if (experience !== undefined) doctor.experience = experience;
        if (about !== undefined) doctor.about = about;
        if (fees !== undefined) doctor.fees = fees;
        if (available !== undefined) doctor.available = available;
        if (address !== undefined) doctor.address = address;

        // Use updateOne to avoid triggering the password hash middleware
        await Doctor.updateOne({ _id: req.params.id }, {
            name: doctor.name, phone: doctor.phone, gender: doctor.gender,
            speciality: doctor.speciality, degree: doctor.degree, experience: doctor.experience,
            about: doctor.about, fees: doctor.fees, available: doctor.available, address: doctor.address,
        });

        const updatedDoctor = await Doctor.findById(req.params.id).select('-password');
        res.json({ success: true, message: 'Doctor updated successfully', doctor: updatedDoctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
