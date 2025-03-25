import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { HistoriqModule } from './historiq/historiq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongodb:27017/tracking',
    ),

    UserModule,
    AuthModule,
    LocationModule,
    HistoriqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
