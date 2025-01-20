import { Router } from 'express';
import authRoutes from './Auth.routes';
import projectRoutes from './Project.routes';
import { authenticate, checkUserValidity } from '../middleware';

const router = Router();

// Rutas
router.use('/auth', checkUserValidity, authRoutes);
router.use('/projects', authenticate, projectRoutes);

export default router;
