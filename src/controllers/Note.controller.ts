import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note.model';

export class NoteController {
	static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
		try {
			const { content } = req.body;

			// Crear nota
			const note = await Note.create({ content, task: req.task.id, createdBy: req.user.id });

			// Agregar nota a la tarea
			req.task.notes.push(note.id);
			await req.task.save();

			res.status(201).json({ message: 'Nota creada correctamente', data: note });
		} catch (error) {
			res.status(500).json({ error: 'Error al crear la nota' });
		}
	};
}
