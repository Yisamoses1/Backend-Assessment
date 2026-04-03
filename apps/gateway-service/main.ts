import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './src/app.module'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Logger))
  await app.listen(process.env.PORT)
  console.log(`Gateway service is running on port ${process.env.PORT}`)
}
bootstrap()