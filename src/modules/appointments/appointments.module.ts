import { Module } from '@nestjs/common';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';

import { UsersModule } from '../users/users.module';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [UsersModule, ProfessionalsModule, ServicesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
