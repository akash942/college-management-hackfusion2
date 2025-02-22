import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import electionRoutes from './routes/election.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "https://yourdomain.com"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// API Routes (to be imported later)
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.get('/', (req, res) => {
  res.send('College System API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;