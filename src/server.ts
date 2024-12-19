import express from 'express';
import dotenv from 'dotenv';
import projectRoutes from './routes/Project.routes';

dotenv.config();
const app = express();

// Configuraciones
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

export default app;
