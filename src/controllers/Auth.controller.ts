import type { Request, Response } from 'express';

import User from '../models/User.model';
import Token from '../models/Token.model';
import { AuthEmail } from '../emails/AuthEmail';

import { generateJWT } from '../utils/jwt';
import { generateToken } from '../utils/token';
import { hashPassword, verifyPassword } from '../utils/auth';

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Verificar si el usuario existe
			if (req.preUser) {
				res.status(409).json({ error: 'El usuario ya está registrado' });
				return;
			}

			// Hashear contraseña
			const hashedPassword = await hashPassword(password);

			// Asignar username
			const username = email.split('@')[0];

			// Crear y guardar usuario
			const user = await User.create({ ...req.body, password: hashedPassword, username });

			// Generar token para confirmar cuenta
			const token = generateToken();
			await Token.create({ token, user: user._id });

			// Enviar email
			AuthEmail.sendConfirmationEmail({ user, token });

			res.status(201).json({ message: 'Cuenta creada, revise su correo para confirmar su cuenta' });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la cuenta' });
		}
	};

	static login = async (req: Request, res: Response) => {
		try {
			const { password } = req.body;

			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar contraseña
			const isPasswordValid = await verifyPassword(password, req.preUser.password);
			if (!isPasswordValid) {
				res.status(401).json({ error: 'La contraseña es incorrecta' });
				return;
			}

			// Verificar usuario confirmado
			if (!req.preUser.confirmed) {
				// Verificar token existente
				const tokenExists = await Token.findOne({ user: req.preUser._id });
				if (tokenExists) {
					await tokenExists.deleteOne();
				}

				// Generar token
				const token = generateToken();
				await Token.create({ token, user: req.preUser._id });

				// Enviar email
				AuthEmail.sendConfirmationEmail({ user: req.preUser, token });

				res
					.status(401)
					.json({ error: 'La cuenta no ha sido confirmada, se ha enviado un nuevo email para confirmar la cuenta' });
				return;
			}

			// Generar token de sesión
			const sessionToken = generateJWT({ user_id: req.preUser.id });

			res.status(200).json({ message: 'Se ha iniciado sesión correctamente', data: sessionToken });
		} catch (error) {
			res.status(500).json({ error: 'Error al iniciar sesión' });
		}
	};

	static confirmAccount = async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar si el usuario ya está confirmado
			if (req.preUser.confirmed) {
				res.status(400).json({ error: 'El usuario ya está confirmado' });
				return;
			}

			// Verificar token válido y perteneciente al usuario
			const tokenExists = await Token.findOne({ token: token, user: req.preUser.id });
			if (!tokenExists) {
				res.status(404).json({ error: 'El token no es válido' });
				return;
			}

			// Confirmar cuenta y eliminar token
			req.preUser.confirmed = true;
			await Promise.allSettled([req.preUser.save(), tokenExists.deleteOne()]);

			res.status(200).json({ message: 'Cuenta confirmada correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al confirmar la cuenta' });
		}
	};

	static requestCodeConfirmation = async (req: Request, res: Response) => {
		try {
			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar si el usuario ya está confirmado
			if (req.preUser.confirmed) {
				res.status(400).json({ error: 'El usuario ya está confirmado' });
				return;
			}

			// Verificar token existente
			const tokenExists = await Token.findOne({ user: req.preUser._id });
			if (tokenExists) await tokenExists.deleteOne();

			// Generar token
			const token = generateToken();
			await Token.create({ token, user: req.preUser._id });

			// Enviar email
			AuthEmail.sendConfirmationEmail({ user: req.preUser, token });

			res.status(200).json({ message: 'Se ha reenviado el código correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al reenviar el código' });
		}
	};

	static requestCodePassword = async (req: Request, res: Response) => {
		try {
			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar token existente
			const tokenExists = await Token.findOne({ user: req.preUser._id });
			if (tokenExists) await tokenExists.deleteOne();

			// Generar token para cambiar contraseña
			const token = generateToken();
			await Token.create({ token, user: req.preUser._id });

			// Enviar email de cambio de contraseña
			AuthEmail.sendCodeForNewPassword({ user: req.preUser, token });

			res.status(200).json({ message: 'Se ha reenviado el correo correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al reenviar el código' });
		}
	};

	static validateCodePassword = async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar token válido y perteneciente al usuario
			const tokenExists = await Token.findOne({ token: token, user: req.preUser.id });
			if (!tokenExists) {
				res.status(404).json({ error: 'El token no es válido' });
				return;
			}

			res.status(200).json({ message: 'Token válido' });
		} catch (error) {
			res.status(500).json({ error: 'Error al validar el token' });
		}
	};

	static resetPassword = async (req: Request, res: Response) => {
		try {
			const { token, password } = req.body;

			// Verificar si el usuario existe
			if (!req.preUser) {
				res.status(404).json({ error: 'El usuario no existe' });
				return;
			}

			// Verificar token válido y perteneciente al usuario
			const tokenExists = await Token.findOne({ token: token, user: req.preUser.id });
			if (!tokenExists) {
				res.status(404).json({ error: 'El token no es válido' });
				return;
			}

			// Actualizar contraseña
			const hashedPassword = await hashPassword(password);
			req.preUser.password = hashedPassword;

			// Eliminar token y guardar usuario
			await Promise.allSettled([req.preUser.save(), tokenExists.deleteOne()]);

			res.status(200).json({ message: 'Contraseña actualizada correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al cambiar la contraseña' });
		}
	};
}
