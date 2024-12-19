import mongoose, { Schema, Document } from 'mongoose';

// Interfaz del modelo
export interface IProject extends Document {
	clientName: string;
	projectName: string;
	description: string;
}

// Esquema del modelo
const ProjectSchema: Schema = new Schema({
	clientName:  { type: String, required: true, trim: true },
	projectName: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
});

// Exportar el modelo y el tipo de interfaz
export default mongoose.model<IProject>('Project', ProjectSchema);