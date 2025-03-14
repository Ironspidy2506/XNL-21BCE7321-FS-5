import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import loginRouter from './routes/loginRouter.js';

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({
    origin: 'https://xnl-21bce7321.vercel.app',
  }));

app.use('/api/auth', loginRouter);

// Sample route
app.get('/', (req, res) => {
    res.send('API is working fine!!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});