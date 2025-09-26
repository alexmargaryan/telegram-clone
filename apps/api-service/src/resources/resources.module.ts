import { ChatsModule } from "@/resources/chats/chats.module";
import { MessagesModule } from "@/resources/messages/messages.module";
import { UsersModule } from "@/resources/users/users.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule, ChatsModule, MessagesModule],
})
export class ResourcesModule {}
