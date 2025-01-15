import { Router } from 'express';
import authRoutes from './Auth.routes';
import projectRoutes from './Project.routes';

const router = Router();

// Rutas
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

export default router;
