import type { Request, Response } from 'express';
import User from '../models/User.model';
import Token from '../models/Token.model';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';

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

			res.status(201).json({ message: 'Cuenta creada correctamente', data: user });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la cuenta' });
		}
	};
}
