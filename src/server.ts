import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();
const app = express();

// Configuraciones
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

export default app;
