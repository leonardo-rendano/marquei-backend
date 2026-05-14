import { Module } from '@nestjs/common';

import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsRepository } from './professionals.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService, ProfessionalsRepository],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
