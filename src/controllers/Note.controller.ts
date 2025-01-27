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
			res.status(500).json({ error: 'Error al crear la nota: ' + error.message });
		}
	};

	static deleteNote = async (req: Request, res: Response) => {
		try {
			// Remover nota de la tarea
			req.task.notes = req.task.notes.filter(noteId => noteId.toString() !== req.params.noteId);

			// Eliminar nota y guardar tarea
			await Promise.allSettled([Note.deleteOne({ _id: req.params.noteId }), req.task.save()]);

			res.status(200).json({ message: 'Nota eliminada correctamente' });
		} catch (error) {
			res.status(500).json({ error: 'Error al eliminar la nota' });
		}
	};
}
