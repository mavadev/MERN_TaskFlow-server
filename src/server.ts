import express from 'express';
import dotenv from 'dotenv';
import projectRouter from './routes/Project.routes';

dotenv.config();
const app = express();

// Routes
app.use('/api/projects', projectRouter);

export default app;
