import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from './common/validation.pipe'
import { AllExceptionFilter } from './common/all-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors()
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true
    })
  )

  await app.listen(configService.get<number>('PORT', 3000))
}
void bootstrap()
