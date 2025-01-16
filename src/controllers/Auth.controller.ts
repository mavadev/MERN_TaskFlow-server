import type { Request, Response } from 'express';
import User from '../models/User.model';
import { hashPassword } from '../utils/auth';

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;
			const user = new User(req.body);

			// Encriptar password
			user.password = await hashPassword(password);

			// Evitar usuarios duplicados
			const userExists = await User.findOne({ email });
			if (userExists) {
				res.status(409).json({ error: 'El usuario ya existe' });
				return;
			}

			await user.save();
			res.status(201).json({ message: 'Cuenta creada correctamente', data: user });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la cuenta' });
		}
	};
}
