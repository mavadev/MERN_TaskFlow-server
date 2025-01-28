import { Router } from 'express';
import authRoutes from './Auth.routes';
import userRoutes from './User.routes';
import projectRoutes from './Project.routes';
import { authenticate, checkEmailValidity } from '../middleware';

const router = Router();

// Rutas
router.use('/auth', checkEmailValidity, authRoutes);
router.use('/user', authenticate, userRoutes);
router.use('/projects', authenticate, projectRoutes);

export default router;
