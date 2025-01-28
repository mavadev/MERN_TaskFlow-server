import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/Auth.controller';
import { checkForValidationErrors, validatePasswordConfirmation } from '../middleware';

export const router = Router();

router.post(
	'/register',
	body('name').notEmpty().withMessage('El nombre no debe ir vacío'),
	body('password').isLength({ min: 8 }).withMessage('El password debe ser de mínimo 8 caracteres'),
	body('password_confirmation')
		.notEmpty()
		.withMessage('La confirmación del password es requerida')
		.custom(validatePasswordConfirmation),
	checkForValidationErrors,
	AuthController.createAccount
);

router.post(
	'/login',
	body('password').notEmpty().withMessage('El password no debe ir vacío'),
	checkForValidationErrors,
	AuthController.login
);

router.post(
	'/confirm-account',
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.confirmAccount
);

router.post('/request-code-confirmation', AuthController.requestCodeConfirmation);

router.post('/request-code-password', AuthController.requestCodePassword);

router.post(
	'/validate-code-password',
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.validateCodePassword
);

router.post(
	'/reset-password',
	body('token').notEmpty().withMessage('El token no debe ir vacío'),
	body('password').notEmpty().withMessage('El password no debe ir vacío'),
	checkForValidationErrors,
	AuthController.resetPassword
);

export default router;
