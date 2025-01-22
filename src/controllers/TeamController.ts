import type { Request, Response } from 'express';
import User from '../models/User.model';

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
}
