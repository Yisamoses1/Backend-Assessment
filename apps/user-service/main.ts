import { ReflectionService } from '@grpc/reflection'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './src/app.module'
import { join } from 'path'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'packages/proto/user.proto'),
      url: process.env.USER_SERVICE_URL,
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server)
      },
    },
  })
  app.useLogger(app.get(Logger))
  await app.listen()
}
bootstrap()