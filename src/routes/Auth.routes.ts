import { Router } from 'express';
import { body, query } from 'express-validator';
import { checkForValidationErrors } from '../middleware';
import { AuthController } from '../controllers/Auth.controller';

const router = Router();

router.post(
	'/create-account',
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
	'/confirm-account',
	body('hashedToken').notEmpty().withMessage('El token no debe ir vacío'),
	checkForValidationErrors,
	AuthController.confirmAccount
);

// TODO: Ruta de prueba para verificar el token
router.get(
	'/confirm-account',
	query('token').notEmpty().withMessage('El token no debe ir vacío'),
	checkForValidationErrors,
	AuthController.getTokenHashed
);
export default router;
