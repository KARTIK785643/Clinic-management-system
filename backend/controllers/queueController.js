import Appointment from '../models/appointmentModel.js';

// @desc    Get patient's active token
// @route   GET /api/queue/my-token
// @access  Private (User)
export const getMyToken = async (req, res) => {
    try {
        const patientId = req.patient._id;
        
        // Find an appointment for this patient that is 'waiting' or 'called'
        const appointment = await Appointment.findOne({ 
            patientId, 
            status: { $in: ['waiting', 'called'] } 
        }).sort({ date: -1 });

        if (appointment) {
            res.json({ success: true, token: appointment });
        } else {
            res.json({ success: false, message: 'No active token found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor's queue
// @route   GET /api/queue/doctor
// @access  Private (Doctor)
export const getDoctorQueue = async (req, res) => {
    try {
        const docId = req.doctor._id;
        
        // Get today's date formatted as DD_MM_YYYY (the format used in slotDate)
        // Wait, slotDate format could be anything. Let's just fetch all 'waiting' or 'called' for this doctor.
        const queue = await Appointment.find({ 
            docId, 
            status: { $in: ['waiting', 'called'] } 
        }).sort({ tokenNumber: 1 });

        res.json({ success: true, queue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Call next patient in queue
// @route   POST /api/queue/call-next
// @access  Private (Doctor)
export const callNextPatient = async (req, res) => {
    try {
        const docId = req.doctor._id;

        // Find currently called patient and mark as completed
        const currentlyCalled = await Appointment.findOne({ docId, status: 'called' });
        if (currentlyCalled) {
            currentlyCalled.status = 'completed';
            currentlyCalled.isCompleted = true;
            await currentlyCalled.save();
        }

        // Find the next waiting patient
        const nextWaiting = await Appointment.findOne({ docId, status: 'waiting' }).sort({ tokenNumber: 1 });
        
        if (nextWaiting) {
            nextWaiting.status = 'called';
            await nextWaiting.save();
            res.json({ success: true, message: 'Next patient called', token: nextWaiting });
        } else {
            res.json({ success: true, message: 'No more patients in queue' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
