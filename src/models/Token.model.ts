import { Document, Schema, model } from 'mongoose';

interface IToken extends Document {
	token: string;
	user: Schema.Types.ObjectId;
	createdAt: Date;
}

const tokenSchema = new Schema({
	token: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 10,
	},
});

export default model<IToken>('Token', tokenSchema);
