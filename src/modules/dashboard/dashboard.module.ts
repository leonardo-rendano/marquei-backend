import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';

import { DashboardService } from './dashboard.service';

import { PrismaModule } from '../../infra/prisma/prisma.module';
import { DashboardRepository } from './dashboard.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
