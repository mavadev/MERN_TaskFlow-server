import type { Request, Response } from 'express';
import Task from '../models/Task.model';
import { taskStatus } from '../models/Task.model';
import { isValidObjectId } from 'mongoose';

export class TaskController {
	static async createTask(req: Request, res: Response) {
		try {
			// Crear tarea
			const task = new Task(req.body);
			// Asignar proyecto
			task.project = req.project.id;
			// Asignar tarea en proyecto
			req.project.tasks.push(task.id);
			// Guardar cambios
			await Promise.allSettled([task.save(), req.project.save()]);
			// Responder con tarea creada
			res.status(201).json({ message: 'Tarea Creada Correctamente', data: task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER - COLABORADORES */
	static async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await Task.find({ project: req.project.id });
			res.status(200).json({ message: 'Tareas Encontradas', data: tasks });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async getTaskByID(req: Request, res: Response) {
		try {
			res.status(200).json({ message: 'Tarea Encontrada', data: req.task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async updateTaskStatus(req: Request, res: Response) {
		try {
			const validStatues = Object.values(taskStatus);
			// Validar estado válido
			if (!validStatues.includes(req.body.status)) {
				res.status(400).json({ error: 'Estado de tarea inválido' });
				return;
			}
			// Actualizar estado de la tarea
			req.task.status = req.body.status;
			await req.task.save();

			res.status(200).json({ message: 'Estado de Tarea Actualizado Correctamente', data: req.task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async assignTask(req: Request, res: Response) {
		try {
			// Validar si se asigna o se designa
			const userAssigned = req.body.assignTo;
			if (userAssigned) {
				// Validar que sea un mongoId
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
			res.status(200).json({ message: 'Acción Realizada Correctamente', data: req.task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	/* MANAGER */
	static async updateTask(req: Request, res: Response) {
		try {
			// Actualizar tarea
			req.task.name = req.body.name;
			req.task.description = req.body.description;
			req.task.status = req.body.status;
			await req.task.save();

			res.status(200).json({ message: 'Tarea Actualizada Correctamente', data: req.task });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	static async deleteTask(req: Request, res: Response) {
		try {
			// Guardamos el proyecto actualizado y eliminamos la tarea
			await Promise.allSettled([req.project.updateOne({ $pull: { tasks: req.task.id } }), req.task.deleteOne()]);

			res.status(200).json({ message: 'Tarea Eliminada Correctamente', data: null });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
