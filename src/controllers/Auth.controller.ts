import type { Request, Response } from 'express';
import User from '../models/User.model';

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const user = new User(req.body);
			await user.save();
			res.status(201).json({ message: 'Cuenta creada correctamente', data: user });
		} catch (error) {
			res.status(500).json({
				message: 'Error al crear la cuenta',
				error: error.message,
			});
		}
	};
}
