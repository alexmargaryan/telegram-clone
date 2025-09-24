import { UsersModule } from "@/resources/users/users.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule],
})
export class ResourcesModule {}
