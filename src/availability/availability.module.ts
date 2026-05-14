import { Module } from '@nestjs/common';

import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityRepository } from './availability.repository';
import { ProfessionalsModule } from '../modules/professionals/professionals.module';

@Module({
  imports: [ProfessionalsModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AvailabilityRepository],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
