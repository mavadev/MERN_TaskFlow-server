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
		const { userId } = req.body;

		try {
			// Verificar que el usuario no exista en el equipo
			if (req.project.team.includes(userId)) {
				res.status(400).json({ error: 'El usuario ya existe en el equipo' });
				return;
			}

			// Verificar que el usuario no sea el manager del proyecto
			if (req.project.manager.toString() === userId) {
				res.status(400).json({ error: 'El usuario no puede ser el manager del proyecto' });
				return;
			}

			// Verificar que el usuario exista
			const user = await User.findById(userId);
			if (!user) {
				res.status(404).json({ error: 'Usuario no encontrado' });
				return;
			}

			// Agregar el usuario al equipo
			req.project.team.push(userId);
			await req.project.save();

			res.status(200).json({ message: 'Usuario agregado al equipo correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static removeMember = async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;

			// Verificar que exista en el equipo
			if (!req.project.team.some(team => team.toString() === userId)) {
				res.status(404).json({ error: 'Usuario no encontrado en el equipo' });
				return;
			}

			// Eliminar el usuario de las tareas asignadas
			await Task.updateMany({ assignedTo: userId }, { $set: { assignedTo: null } });

			// Eliminar el usuario del equipo
			req.project.team = req.project.team.filter(team => team.toString() !== userId);

			await req.project.save();
			res.status(200).json({ message: 'Usuario eliminado del equipo correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};
}
