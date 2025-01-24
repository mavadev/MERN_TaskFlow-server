import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
	content: string;
	project: string;
	createdBy: string;
}

const noteSchema = new Schema(
	{
		content: { type: String, required: true, trim: true },
		task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

export default model<INote>('Note', noteSchema);
