import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppConfigService } from "./app-config.service";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ["error"],
    });
    const appConfig = app.get(AppConfigService);

    app.setGlobalPrefix("/api");
    app.enableCors({
        origin: [/localhost/],
        credentials: true,
        allowedHeaders: ["Content-Type", "Cookie"],
    });
    app.use(cookieParser());

    const port = appConfig.port();
    await app.listen(port);
}
bootstrap();
