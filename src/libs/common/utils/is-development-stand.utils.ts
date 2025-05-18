import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const isDevopmentStand = (configService: ConfigService) =>
	configService.getOrThrow('NODE_ENV') === 'development';

export const IS_DEVELOPMENT_ENVIRONMENTS = process.env.NODE_ENV === 'development';
