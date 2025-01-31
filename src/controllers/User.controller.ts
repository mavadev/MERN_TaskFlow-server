import type { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/auth';
import User from '../models/User.model';
import Project from '../models/Project.model';
import Task from '../models/Task.model';
import Note from '../models/Note.model';

export class UserController {
	static validateUser = async (req: Request, res: Response) => {
		res.status(200).json({ data: req.user });
	};

	static checkPassword = async (req: Request, res: Response) => {
		try {
			const { password } = req.body;

			// Validar que la contraseña sea correcta
			const isPasswordCorrect = await verifyPassword(password, req.user.password);
			if (!isPasswordCorrect) {
				res.status(401).json({ error: 'Contraseña incorrecta' });
				return;
			}

			res.status(200).json({ message: 'Contraseña correcta' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static getProfile = async (req: Request, res: Response) => {
		try {
			// Obtener el usuario
			const user = await User.findById(req.user.id).select(
				'avatar name username email description createdAt updatedAt allowCollaborate allowCollaborators'
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

	static updateProfile = async (req: Request, res: Response) => {
		try {
			const { name, email, description } = req.body;

			// Validar que el email no exista
			const user = await User.findOne({ email, _id: { $ne: req.user.id } });
			if (user) {
				res.status(400).json({ error: 'El email se encuentra en uso' });
				return;
			}

			// Actualizar el perfil
			req.user.name = name;
			req.user.email = email;
			req.user.description = description;
			await req.user.save();

			res.status(200).json({ message: 'Perfil actualizado correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static updateContribution = async (req: Request, res: Response) => {
		try {
			const { collaborate, collaborators } = req.body;

			req.user.allowCollaborate = collaborate;
			req.user.allowCollaborators = collaborators;

			await req.user.save();

			res.status(200).json({ message: 'Contribución actualizada correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static updateUsername = async (req: Request, res: Response) => {
		try {
			const { username } = req.body;

			// Validar que el username no exista
			const user = await User.findOne({ username, _id: { $ne: req.user.id } });
			if (user) {
				res.status(400).json({ error: 'El nombre de usuario se encuentra en uso' });
				return;
			}

			req.user.username = username;
			await req.user.save();

			res.status(200).json({ message: 'Nombre de usuario actualizado correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static deleteProfile = async (req: Request, res: Response) => {
		try {
			// Retirar de todos los proyectos en los que colabora
			await Project.updateMany({ team: req.user.id }, { $pull: { team: req.user.id } });

			// Obtener todos los proyectos del usuario
			const projects = await Project.find({ manager: req.user.id }).select('_id');
			const projectsIds = projects.map(project => project._id);

			// Obtener todas las tareas del usuario
			const tasks = await Task.find({ project: { $in: projectsIds } }).select('_id');
			const tasksIds = tasks.map(task => task._id);

			await Promise.allSettled([
				Note.deleteMany({ task: { $in: tasksIds } }),
				Task.deleteMany({ project: { $in: projectsIds } }),
				Project.deleteMany({ manager: req.user.id }),
				req.user.deleteOne(),
			]);

			res.status(200).json({ message: 'Perfil eliminado' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error.message });
		}
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
