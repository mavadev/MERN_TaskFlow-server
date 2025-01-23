import type { Request, Response } from 'express';
import User from '../models/User.model';
import Project from '../models/Project.model';

export class TeamController {
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

	static getTeam = async (req: Request, res: Response) => {
		try {
			const project = await Project.findById(req.project.id).populate({
				path: 'team',
				select: 'id name email avatar',
			});

			res.status(200).json({ data: project.team });
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

			// Eliminar el usuario del equipo
			req.project.team = req.project.team.filter(team => team.toString() !== userId);

			await req.project.save();
			res.status(200).json({ message: 'Usuario eliminado del equipo correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	static getUsersByUsername = async (req: Request, res: Response) => {
		try {
			const { username } = req.body;

			const users = await User.find({ username: { $regex: username, $options: 'i' } }).select(
				'avatar id name username description'
			);

			// Filtrar los usuarios que ya están en el equipo
			const filteredUsers = users.filter(
				user => !req.project.team.includes(user.id) && req.project.manager.toString() !== user.id
			);

			res.status(200).json({ message: `Se encontraron ${users.length} usuarios`, data: filteredUsers });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};
}
