import type { Request, Response } from 'express';
import User from '../models/User.model';
import Token from '../models/Token.model';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Verificar si el usuario existe
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				res.status(409).json({ error: 'El usuario ya existe' });
				return;
			}

			// Crear y guardar usuario
			const hashedPassword = await hashPassword(password);
			const user = await User.create({ ...req.body, password: hashedPassword });

			// Generar y guardar token
			const token = generateToken();
			await Token.create({ token, user: user._id });

			AuthEmail.confirmAccount({
				name: user.name,
				email: user.email,
				token: token,
			});

			res.status(201).json({ message: 'Cuenta creada correctamente', data: user });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la cuenta' });
		}
	};

	static confirmAccount = async (req: Request, res: Response) => {
		try {
			const { token, user_id } = req.body;

			// Verificar si el usuario existe
			const user = await User.findById(user_id);
			if (!user) {
				res.status(404).json({ error: 'Usuario no encontrado' });
				return;
			}

			// Verificar token válido y perteneciente al usuario
			const tokenExists = await Token.findOne({ token, user: user._id });
			if (!tokenExists) {
				res.status(404).json({ error: 'Token no válido' });
				return;
			}

			// Confirmar cuenta y eliminar token
			user.confirmed = true;
			await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

			res.status(200).json({ message: 'Cuenta confirmada correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al confirmar la cuenta' });
		}
	};
}
