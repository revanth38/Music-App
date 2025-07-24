import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Revanth:Revanth@myatlasclusteredu.xivs4ht.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU'),
    AuthModule,
    SongsModule,
  ],
})
export class AppModule {}
