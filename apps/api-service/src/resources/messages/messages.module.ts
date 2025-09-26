import { Module } from "@nestjs/common";

import { ChatsModule } from "../chats/chats.module";
import { MessagesController } from "./messages.controller";
import { MessagesRepository } from "./messages.repository";
import { MessagesService } from "./messages.service";

@Module({
  imports: [ChatsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
