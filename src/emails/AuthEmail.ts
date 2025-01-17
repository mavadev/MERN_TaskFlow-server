import { transport } from '../config/nodemailer';
import { IUser } from '../models/User.model';
import { generateHashedToken } from '../utils/token';

interface IConfirmAccount {
	user: IUser;
	token: string;
}

export class AuthEmail {
	static sendConfirmationEmail = async ({ user, token }: IConfirmAccount) => {
		const hashedToken = generateHashedToken({ user_id: user.id, token });

		const email = await transport.sendMail({
			from: 'TaskFlow <no-reply@taskflow.com>',
			to: user.email,
			subject: 'TaskFlow -Confirma tu cuenta',
			text: 'TaskFlow -Confirma tu cuenta',
			html: `<p>Hola <b>${user.name}</b>, has creado tu cuenta en TaskFlow</p><br>
				<p>Para confirmar tu cuenta, ingresa al siguiente enlace: 
					<a href="http://localhost:4000/api/auth/confirm-account?token=${hashedToken}">Confirmar cuenta</a></p><br>
				<p>Este enlace expira en 10 minutos.</p><br>
				<p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>`,
		});

		console.log('Mensaje enviado', email.messageId);
	};
}
