import { AuthMethod } from '@prisma/__generated__';

export class CreateUserDto {
	//TODO: add decorators
	email: string;
	password: string;
	pictureUrl: string;
	displayName: string;
	isVerified: boolean;
	method: AuthMethod;
}
