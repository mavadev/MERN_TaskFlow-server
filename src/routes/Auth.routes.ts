import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, checkForValidationErrors, checkEmailValidity } from '../middleware';
import { AuthController } from '../controllers/Auth.controller';

const router = Router();

const validatePasswordConfirmation = (value, { req }) => {
	if (value !== req.body.password) {
		throw new Error('Las contraseñas no coinciden');
	}
	return true;
};

router.post(
	'/register',
	checkEmailValidity,
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
	checkEmailValidity,
	body('password').notEmpty().withMessage('El password no debe ir vacío'),
	checkForValidationErrors,
	AuthController.login
);

router.post(
	'/confirm-account',
	checkEmailValidity,
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.confirmAccount
);

router.post('/request-code-confirmation', checkEmailValidity, AuthController.requestCodeConfirmation);

router.post('/request-code-password', checkEmailValidity, AuthController.requestCodePassword);

router.post(
	'/validate-code-password',
	checkEmailValidity,
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.validateCodePassword
);

router.post(
	'/reset-password',
	checkEmailValidity,
	body('token').notEmpty().withMessage('El token no debe ir vacío'),
	body('password').notEmpty().withMessage('El password no debe ir vacío'),
	checkForValidationErrors,
	AuthController.resetPassword
);

router.get('/user', authenticate, AuthController.getUser);

export default router;
