import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    slotDate: {
      type: String,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    patientData: {
      type: Object,
      required: true,
    },
    docData: {
      type: Object,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Number,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'waiting', // waiting, called, completed, cancelled
    },
    tokenNumber: {
      type: Number,
      default: null,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
