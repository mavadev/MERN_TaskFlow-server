import type { Request, Response } from 'express';
import User from '../models/User.model';
import Token from '../models/Token.model';
import { AuthEmail } from '../emails/AuthEmail';
import { hashPassword, verifyPassword } from '../utils/auth';
import { generateToken, decodedHashedToken } from '../utils/token';

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Verificar si el usuario existe
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				res.status(409).json({ error: 'El usuario ya está registrado' });
				return;
			}

			// Crear y guardar usuario
			const hashedPassword = await hashPassword(password);
			const user = await User.create({ ...req.body, password: hashedPassword });

			// Generar token para confirmar cuenta
			const token = generateToken();
			await Token.create({ token, user: user._id });

			// Enviar email
			AuthEmail.sendConfirmationEmail({
				user: user,
				token: token,
			});

			res.status(201).json({ message: 'Cuenta creada, revise su correo para confirmar su cuenta', data: user });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la cuenta' });
		}
	};

	static confirmAccount = async (req: Request, res: Response) => {
		try {
			const { user: user_id, token } = req.body;

			// Verificar si el usuario existe
			const user = await User.findById(user_id);
			if (!user) {
				res.status(404).json({ error: 'Usuario no encontrado' });
				return;
			}

			// Verificar token válido y perteneciente al usuario
			const tokenExists = await Token.findOne({ token: token, user: user_id });
			if (!tokenExists) {
				res.status(404).json({ error: 'Token no válido' });
				return;
			}

			// Confirmar cuenta y eliminar token
			user.confirmed = true;
			await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

			res.status(200).json({ message: 'Cuenta confirmada correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Token no válido' });
		}
	};

	// ? TODO: Controlador de prueba para verificar el token hasheado
	static getTokenHashed = async (req: Request, res: Response) => {
		try {
			const { token } = req.query;
			const decodedToken = decodedHashedToken(token as string);

			console.log('Token Codificado: ', token);
			console.log('Contenido del token decodificado: ', decodedToken);

			res.status(200).json({ token: token });
		} catch (error) {
			res.status(500).json({ error: 'Enlace no válido' });
		}
	};

	static login = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Verificar si el usuario existe
			const user = await User.findOne({ email });
			if (!user) {
				res.status(404).json({ error: 'Usuario no encontrado' });
				return;
			}

			// Verificar contraseña
			const isPasswordValid = await verifyPassword(password, user.password);
			if (!isPasswordValid) {
				res.status(401).json({ error: 'Contraseña incorrecta' });
				return;
			}

			// Verificar usuario confirmado
			if (!user.confirmed) {
				// Verificar token existente
				const tokenExists = await Token.findOne({ user: user._id });
				if (tokenExists) {
					await tokenExists.deleteOne();
				}

				// Generar token
				const token = generateToken();
				await Token.create({ token, user: user._id });

				// Enviar email
				AuthEmail.sendConfirmationEmail({
					user: user,
					token: token,
				});

				res
					.status(401)
					.json({ error: 'La cuenta no ha sido confirmada, se ha enviado un nuevo email para confirmar la cuenta' });
				return;
			}

			res.status(200).json({ message: 'Inicio de sesión exitoso' });
		} catch (error) {
			res.status(500).json({ error: 'Error al iniciar sesión' });
		}
	};
}
