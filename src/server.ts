import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import apiRoutes from './routes';
import { corsConfig } from './config/cors';

dotenv.config();
const app = express();

// Configuraciones
app.use(cors(corsConfig));
app.use(express.json());
app.use(morgan('dev'));

// Configuración de archivos estáticos
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', apiRoutes);

export default app;
