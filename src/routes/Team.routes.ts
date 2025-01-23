import { Router } from 'express';
import { body, param } from 'express-validator';

import { checkForValidationErrors } from '../middleware';
import { TeamController } from '../controllers/TeamController';

const router = Router();

router.post(
	'/addMember',
	body('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	TeamController.addMember
);

router.get('/', TeamController.getTeam);

router.delete(
	'/:userId',
	param('userId').isMongoId().notEmpty().withMessage('El ID del Usuario es Obligatorio'),
	checkForValidationErrors,
	TeamController.removeMember
);

router.post(
	'/find',
	body('email').isEmail().notEmpty().withMessage('El email es obligatorio'),
	checkForValidationErrors,
	TeamController.getUserByEmail
);

export default router;
