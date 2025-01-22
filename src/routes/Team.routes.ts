import { Router } from 'express';
import { body } from 'express-validator';

import { checkForValidationErrors } from '../middleware';
import { TeamController } from '../controllers/TeamController';

const router = Router();

router.post(
	'/addMember',
	body('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	TeamController.addMember
);

export default router;
