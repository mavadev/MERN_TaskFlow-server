import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import projectRoutes from './routes/Project.routes';
import taskRoutes from './routes/Task.routes';

dotenv.config();
const app = express();

// Configuraciones
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/projects', projectRoutes, taskRoutes);

export default app;
