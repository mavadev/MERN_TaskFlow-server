import dotenv from 'dotenv';
import { IUser } from '../models/User.model';
import { transport } from '../config/nodemailer';
dotenv.config({ path: '.env' });

interface IConfirmAccount {
	user: IUser;
	token: string;
}

export class AuthEmail {
	static sendConfirmationEmail = async ({ user, token }: IConfirmAccount) => {
		const email = await transport.sendMail({
			from: 'TaskFlow <no-reply@taskflow.com>',
			to: user.email,
			subject: 'TaskFlow -Confirma tu cuenta',
			text: 'TaskFlow -Confirma tu cuenta',
			html: `<p>Hola <b>${user.name}</b>, has creado tu cuenta en TaskFlow</p><br>
				<p>Código de confirmación: ${token}</p>
				<p>Para confirmar tu cuenta, ingresa en el siguiente enlace: 
					<a href="${process.env.FRONTEND_URL}/auth/confirm-account?user=${user.id}">Confirmar cuenta</a></p><br>
				<p>Este código expira en 10 minutos.</p><br>
				<p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>`,
		});

		console.log('Mensaje enviado', email.messageId);
	};
}
