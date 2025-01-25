import type { Request, Response } from 'express';
import User from '../models/User.model';

export class UserController {
	static getUser = async (req: Request, res: Response) => {
		try {
			const user = await User.findById(req.user.id).select(
				'avatar name username email description createdAt updatedAt'
			);
			res.status(200).json({ data: user });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};
}
