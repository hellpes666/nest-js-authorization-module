import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/__generated__';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.gurad';
import { RolesGuard } from '../guards/roles.guard';

/**
 * Декоратор для авторизации пользователей на основе их ролей.
 *
 * Если указаны роли, применяется декоратор `Roles` и используются guard'ы `AuthGuard` и `RolesGuard`.
 * Если роли не указаны, применяется только guard `AuthGuard`.
 *
 * @param {...UserRole[]} roles - Список ролей, которым разрешён доступ к ресурсу.
 * @returns {MethodDecorator & ClassDecorator} Декоратор для методов или классов контроллера.
 */
export function Authorization(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
	}

	return applyDecorators(UseGuards(AuthGuard));
}
