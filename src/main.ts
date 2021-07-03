import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppConfigService } from "./app-config.service";
import { AppModule } from "./app.module";

const LogLevel = {
    "0": ["error", "warn", "log", "debug", "verbose"],
    "1": ["error", "warn", "log", "debug"],
    "2": ["error", "warn", "log"],
    "3": ["error", "warn"],
    "4": ["error"],
    "5": [],
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: LogLevel[process.env.LOG_LEVEL],
    });
    const appConfig = app.get(AppConfigService);

    app.setGlobalPrefix("/api");
    app.enableCors({
        origin: appConfig.cors(),
        credentials: true,
    });
    app.use(
        cookieParser({
            domain: process.env.COOKIE_DOMAIN,
        }),
    );

    const port = appConfig.port();
    await app.listen(port);
}
bootstrap();
