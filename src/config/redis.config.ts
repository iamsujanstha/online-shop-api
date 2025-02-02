import { ConfigService } from '@nestjs/config';

export default async (configService: ConfigService) => {
  return {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    ttl: 120,
    // username: configService.get('REDIS_USERNAME'),
    // password: configService.get('REDIS_PASSWORD'),
    // no_ready_check: process.env.NODE_ENV === 'production',
  };
};
