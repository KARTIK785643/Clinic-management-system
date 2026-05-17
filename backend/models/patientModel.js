import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      default: '0000000000',
    },
    image: {
      type: String,
      default: '',
    },
    address: {
      type: Object,
      default: { line1: '', line2: '' },
    },
    gender: {
      type: String,
      default: 'Not Selected',
    },
    dob: {
      type: String,
      default: 'Not Selected',
    },
  },
  { timestamps: true }
);

// Method to compare entered password with hashed password
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
