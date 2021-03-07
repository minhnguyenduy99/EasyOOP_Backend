import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppConfigService } from "./app-config.service";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const appConfig = app.get(AppConfigService);

    app.enableCors({
        origin: [/localhost/],
        credentials: true,
    });
    app.use(cookieParser());

    const host = appConfig.host();
    const port = appConfig.port();
    await app.listen(port, host, () => {
        console.log(`Server started at ${host}:${port}`);
    });
}
bootstrap();
