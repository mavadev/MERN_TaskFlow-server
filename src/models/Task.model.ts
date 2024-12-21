import mongoose, { Schema, Document, Types } from 'mongoose';

// Estado de la tarea
export const taskStatus = {
	PENDING: 'pending',
	ON_HOLD: 'onHold',
	IN_PROGRESS: 'inProgress',
	UNDER_REVIEW: 'underReview',
	COMPLETED: 'completed',
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

// Interfaz del modelo
export interface ITask extends Document {
	name: string;
	description: string;
	project: Types.ObjectId;
	status: TaskStatus;
}

// Esquema del modelo
const TaskSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		project: {
			type: Types.ObjectId,
			required: true,
			ref: 'Project',
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(taskStatus),
			default: taskStatus.PENDING,
		},
	},
	{ timestamps: true }
);

// Exportar el modelo y el tipo de interfaz
export default mongoose.model<ITask>('Task', TaskSchema);
