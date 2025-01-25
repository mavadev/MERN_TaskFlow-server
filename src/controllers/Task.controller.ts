import { isValidObjectId } from 'mongoose';
import type { Request, Response } from 'express';
import Task from '../models/Task.model';
import { taskStatus } from '../models/Task.model';

export class TaskController {
	static async createTask(req: Request, res: Response) {
		try {
			const task = await Task.create({ ...req.body, project: req.project.id });

			// Añadir tarea al proyecto
			req.project.tasks.push(task.id);
			await req.project.save();

			res.status(201).json({ message: 'Tarea Creada Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER - COLABORADORES */
	static async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await Task.find({ project: req.project.id }).populate({
				path: 'assignedTo',
				select: 'name avatar username description',
			});
			res.status(200).json({ message: 'Tareas Encontradas', data: tasks });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async getTaskByID(req: Request, res: Response) {
		try {
			const task = await Task.findById(req.params.taskId)
				.populate({
					path: 'assignedTo',
					select: 'name avatar username',
				})
				.populate({
					path: 'notes',
					select: 'content createdAt',
				});
			res.status(200).json({ message: 'Tarea Encontrada', data: task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async updateTaskStatus(req: Request, res: Response) {
		try {
			const validStatues = Object.values(taskStatus);

			if (!validStatues.includes(req.body.status)) {
				res.status(400).json({ error: 'Estado de tarea inválido' });
				return;
			}

			req.task.status = req.body.status;
			await req.task.save();

			res.status(200).json({ message: 'Estado de Tarea Actualizado Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async assignTask(req: Request, res: Response) {
		try {
			const userAssigned = req.body.assignTo;
			if (userAssigned) {
				// Validar que sea un id válido
				if (!isValidObjectId(userAssigned)) {
					res.status(400).json({ error: 'El ID del Usuario no es válido' });
					return;
				}

				// Validar que el usuario sea un colaborador del proyecto
				if (!req.project.team.includes(userAssigned) && req.project.manager.toString() !== userAssigned) {
					res.status(400).json({ error: 'El usuario no pertenece al equipo del proyecto' });
					return;
				}

				req.task.assignedTo = req.body.assignTo;
			} else {
				req.task.assignedTo = null;
			}

			await req.task.save();
			res.status(200).json({ message: 'Acción Realizada Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER */
	static async updateTask(req: Request, res: Response) {
		try {
			await Task.findByIdAndUpdate(req.task.id, req.body, { new: true });
			res.status(200).json({ message: 'Tarea Actualizada Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async deleteTask(req: Request, res: Response) {
		try {
			await Promise.allSettled([req.project.updateOne({ $pull: { tasks: req.task.id } }), req.task.deleteOne()]);

			res.status(200).json({ message: 'Tarea Eliminada Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
