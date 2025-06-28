import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { verifyToken } from './middleware/auth.js';

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://advay:advay@cluster0.gsco8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'abc123';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const FRONTEND_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://your-frontend-domain.com'
  : 'http://localhost:3000';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());
app.set('jwt-secret', JWT_SECRET);
app.use('/api/auth', authRoutes);
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('JWT Secret configured:', JWT_SECRET ? 'Yes' : 'No');
});
