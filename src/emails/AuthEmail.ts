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
			html: `<p>Hola <b>${user.name}</b>, has creado tu cuenta en TaskFlow</p>
				<p>Te hemos enviado un código de seguridad para confirmar tu cuenta</p><br>
				<p>Código de confirmación:</p>
				<p><b>${token}</b></p>
				<p>Este código expira en <b><i>10 minutos</i></b>.</p><br>
				<p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>`,
		});

		console.log('Mensaje enviado', email.messageId);
	};
}
