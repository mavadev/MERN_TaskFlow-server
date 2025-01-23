import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	confirmed: boolean;
}

const UserSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, lowercase: true, unique: true },
		password: { type: String, required: true },
		confirmed: { type: Boolean, default: false },
		avatar: { type: String, default: '/images/default-avatar.jpg' },
		username: { type: String, required: true, unique: true },
		description: { type: String, default: '', maxlength: 160 },
	},
	{ timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
