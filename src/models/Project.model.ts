import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { ITask } from './Task.model';
import { IUser } from './User.model';

// Interfaz del modelo
export interface IProject extends Document {
	clientName: string;
	projectName: string;
	description: string;
	tasks: PopulatedDoc<ITask & Document>[];
	manager: PopulatedDoc<IUser & Document>;
	team: PopulatedDoc<IUser & Document>[];
}

// Esquema del modelo
const ProjectSchema: Schema = new Schema(
	{
		clientName: { type: String, required: true, trim: true },
		projectName: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		tasks: [{ type: Types.ObjectId, ref: 'Task' }],
		manager: { type: Types.ObjectId, ref: 'User', required: true },
		team: [{ type: Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

// Exportar el modelo y el tipo de interfaz
export default mongoose.model<IProject>('Project', ProjectSchema);
