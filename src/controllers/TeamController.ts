import type { Request, Response } from 'express';
import User from '../models/User.model';
import Task from '../models/Task.model';
import Project from '../models/Project.model';

export class TeamController {
	static getTeam = async (req: Request, res: Response) => {
		try {
			const { manager, team } = await Project.findById(req.project.id).populate({
				path: 'manager team',
				select: 'name avatar username',
			});

			res.status(200).json({ data: { manager, team } });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static getUsersByUsername = async (req: Request, res: Response) => {
		try {
			const { username } = req.body;
			const { manager, team } = req.project;
			const excludedIds = [manager, ...team];

			const users = await User.find({
				_id: { $nin: excludedIds },
				username: { $regex: username, $options: 'i' },
			}).select('name avatar username');

			res.status(200).json({ message: `Se encontraron ${users.length} usuarios`, data: users });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static addMember = async (req: Request, res: Response) => {
		const { userId } = req.params;

		try {
			// Verificar que el usuario exista
			const user = await User.findById(userId);
			if (!user) {
				res.status(404).json({ error: 'Usuario no encontrado' });
				return;
			}

			// Verificar que el usuario no exista en el equipo
			if (req.project.team.includes(user.id)) {
				res.status(400).json({ error: 'El usuario es colaborador del proyecto' });
				return;
			}

			// Verificar que el usuario no sea el manager del proyecto
			if (req.project.manager.toString() === userId) {
				res.status(400).json({ error: 'El usuario es manager del proyecto' });
				return;
			}

			// Agregar el usuario al equipo
			req.project.team.push(user.id);
			await req.project.save();

			res.status(200).json({ message: 'Usuario agregado al equipo correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static removeMember = async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;

			// Verificar que no sea el manager
			if (req.project.manager.toString() === userId) {
				res.status(400).json({ error: 'No puedes remover al manager del proyecto' });
				return;
			}

			// Verificar que pertenezca al equipo
			if (!req.project.team.some(team => team.toString() === userId)) {
				res.status(404).json({ error: 'Usuario no encontrado en el equipo' });
				return;
			}

			// Eliminar el usuario del equipo
			req.project.team = req.project.team.filter(team => team.toString() !== userId);

			// Designar al usuario de sus tareas
			await Promise.allSettled([
				req.project.save(),
				Task.updateMany({ assignedTo: req.user.id }, { $set: { assignedTo: null } }),
			]);

			res.status(200).json({ message: 'Usuario eliminado del equipo correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static exitProject = async (req: Request, res: Response) => {
		try {
			// Verificar que no sea el manager
			if (req.project.manager.toString() === req.user.id) {
				res.status(400).json({ error: 'El manager no puede salir del proyecto' });
				return;
			}

			// Verificar que pertenezca al equipo
			if (!req.project.team.some(team => team.toString() === req.user.id)) {
				res.status(404).json({ error: 'No perteneces a este proyecto' });
				return;
			}

			// Eliminar el usuario del equipo
			req.project.team = req.project.team.filter(team => team.toString() !== req.user.id);

			// Designar al usuario de sus tareas
			await Promise.allSettled([
				req.project.save(),
				Task.updateMany({ assignedTo: req.user.id }, { $set: { assignedTo: null } }),
			]);

			res.status(200).json({ message: 'Colaborador removido del proyecto' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};
}
