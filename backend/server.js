import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Routes
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes  from './routes/doctorRoutes.js';
import adminRoutes   from './routes/adminRoutes.js';
import queueRoutes   from './routes/queueRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors',  doctorRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/queue',    queueRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'CareSync API is running...' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ CareSync server running on port ${PORT}`);
});
