import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/__generated__';

/**
 * Декоратор параметра для получения авторизованного пользователя или определённого поля пользователя из запроса.
 *
 * @param data - Ключ поля пользователя, который требуется получить. Если не указан, возвращается весь объект пользователя.
 * @param context - Контекст выполнения запроса (ExecutionContext).
 * @returns Значение указанного поля пользователя или весь объект пользователя.
 *
 * @example
 * // Для получения всего объекта пользователя:
 * @Authorized() user: User
 *
 * // Для получения определённого поля (например, userId):
 * @Authorized('userId') userId: string
 */
export const Authorized = createParamDecorator((data: keyof User, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	const user = request.user;

	return data ? user[data] : user;
});
