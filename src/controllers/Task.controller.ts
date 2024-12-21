import type { Request, Response } from 'express';
import Task from '../models/Task.model';

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
			res.status(201).json(task);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await Task.find({ project: req.project.id });
			res.status(200).json(tasks);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getTaskByID(req: Request, res: Response) {
		try {
			res.status(200).json(req.task);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async updateTask(req: Request, res: Response) {
		try {
			// Actualizar tarea
			req.task.name = req.body.name;
			req.task.description = req.body.description;
			req.task.status = req.body.status;
			await req.task.save();

			res.status(200).json(req.task);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteTask(req: Request, res: Response) {
		try {
			// Guardamos el proyecto actualizado y eliminamos la tarea
			await Promise.allSettled([
				req.project.updateOne({ $pull: { tasks: req.task.id } }),
				req.task.deleteOne()
			]);

			res.status(200).json({ message: 'Tarea Eliminada Correctamente' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
