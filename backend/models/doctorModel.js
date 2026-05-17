import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '0000000000',
    },
    gender: {
      type: String,
      default: 'Not Selected',
    },
    speciality: {
      type: String,
      default: 'Not Selected',
    },
    degree: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
    available: {
      type: Boolean,
      default: true,
    },
    fees: {
      type: Number,
      default: 0,
    },
    address: {
      type: Object,
      default: { line1: '', line2: '' },
    },
    date: {
      type: Number,
      default: Date.now,
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamps: true } // minimize: false ensures empty objects like slots_booked are saved
);

// Method to compare entered password with hashed password
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
