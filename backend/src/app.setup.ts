import { type INestApplication, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Everything `main.ts` does to the app besides listening — shared with the
 * end-to-end tests, so they exercise the same prefix, validation and proxy
 * handling that production does.
 */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      // Unknown fields are an error, not silently dropped: a client sending
      // `questionID` should hear about it.
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Behind Caddy and nginx, the client's address is in X-Forwarded-For.
  // Trusting only private and loopback hops means the rate limiter sees the
  // visitor's IP, and a visitor cannot choose one by sending the header.
  (app as NestExpressApplication).set('trust proxy', 'loopback, linklocal, uniquelocal');
  app.enableShutdownHooks();
}
