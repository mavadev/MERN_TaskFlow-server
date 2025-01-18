import { Router } from 'express';
import { body, query } from 'express-validator';
import { checkForValidationErrors } from '../middleware';
import { AuthController } from '../controllers/Auth.controller';

const router = Router();

router.post(
	'/register',
	body('name').notEmpty().withMessage('El nombre no debe ir vacío'),
	body('email').isEmail().withMessage('Email no válido'),
	body('password').isLength({ min: 8 }).withMessage('El password debe ser de mínimo 8 caracteres'),
	body('password_confirmation')
		.notEmpty()
		.withMessage('La confirmación del password es requerida')
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Las contraseñas no coinciden');
			}
			return true;
		}),
	checkForValidationErrors,
	AuthController.createAccount
);

router.post(
	'/login',
	body('email').notEmpty().withMessage('El email no debe ir vacío'),
	body('password').notEmpty().withMessage('El password no debe ir vacío'),
	checkForValidationErrors,
	AuthController.login
);

router.post(
	'/confirm-account',
	body('email').notEmpty().withMessage('El email no debe ir vacío'),
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.confirmAccount
);

router.post(
	'/request-code',
	body('email').notEmpty().withMessage('El email no debe ir vacío'),
	checkForValidationErrors,
	AuthController.requestCode
);

router.post(
	'/request-new-password',
	body('email').notEmpty().withMessage('El email no debe ir vacío'),
	checkForValidationErrors,
	AuthController.requestNewPassword
);

router.post(
	'/confirm-new-password',
	body('email').notEmpty().withMessage('El email no debe ir vacío'),
	body('token').notEmpty().withMessage('El código no debe ir vacío'),
	checkForValidationErrors,
	AuthController.confirmNewPassword
);

export default router;
