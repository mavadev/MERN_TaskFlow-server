import type { Request, Response } from 'express';
import User from '../models/User.model';
import Project from '../models/Project.model';
import { hashPassword, verifyPassword } from '../utils/auth';

export class UserController {
	static getUser = async (req: Request, res: Response) => {
		try {
			// Obtener el usuario
			const user = await User.findById(req.user.id).select(
				'avatar name username email description createdAt updatedAt'
			);

			// Obtener los proyectos del usuario
			const managedProjects = await Project.find({ manager: req.user.id }).select('projectName team').populate({
				path: 'manager',
				select: 'name avatar username',
			});

			// Obtener los proyectos en los que colabora
			const teamProjects = await Project.find({ team: { $in: req.user.id } })
				.select('projectName team')
				.populate({
					path: 'manager',
					select: 'name avatar username',
				});

			const projects = { managedProjects, teamProjects };

			res.status(200).json({ data: { user, projects } });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static validateUser = async (req: Request, res: Response) => {
		res.status(200).json({ data: req.user });
	};

	static changePassword = async (req: Request, res: Response) => {
		try {
			const { current_password, password } = req.body;

			// Validar que el password sea correcto
			if (!verifyPassword(current_password, req.user.password)) {
				res.status(401).json({ error: 'Contraseña incorrecta' });
				return;
			}

			// Hashear nueva contraseña
			req.user.password = await hashPassword(password);

			// Guardar usuario con nueva contraseña
			await req.user.save();

			res.status(200).json({ message: 'Contraseña actualizada correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};
}
