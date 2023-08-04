import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './config'; 
import * as fs from 'fs';

async function bootstrap() {
    const appConfig = {};
    const corsConfig = {}

    const useTls = Config.useTls;
    const useCors = Config.useCors;

    //get httpsConfig if using TLS
    if (useTls) {
        appConfig['httpOptions'] = {
            cert: fs.readFileSync(Config.certFilePath),
            key: fs.readFileSync(Config.keyFilePath)
        }
    }
    
    //create app 
    const app = await NestFactory.create(AppModule, appConfig)

    //use cors if specified 
    if (useCors) {
        corsConfig['origin'] = function (origin, callback) {
            callback(null, (origin && origin.toLowerCase().trim() == Config.allowedCorsOrigin));
        }
        app.enableCors(corsConfig);
    }

    //basic config 
    const config = new DocumentBuilder().setTitle('Soundbeats API').setVersion('1.0').build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    //start listening 
    await app.listen(Config.listenPort);
}
bootstrap();
