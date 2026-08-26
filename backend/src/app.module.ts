import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordsModule } from './records/records.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [RecordsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
