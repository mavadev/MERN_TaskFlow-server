import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz del modelo
export interface ITask extends Document {
	name: string;
	description: string;
	project: Types.ObjectId;
}

// Esquema del modelo
const TaskSchema: Schema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		project: { type: Types.ObjectId, ref: 'Project', required: true },
	},
	{ timestamps: true }
);

// Exportar el modelo y el tipo de interfaz
export default mongoose.model<ITask>('Task', TaskSchema);
