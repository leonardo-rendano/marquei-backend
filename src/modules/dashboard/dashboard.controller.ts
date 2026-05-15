import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { Role } from '@prisma/client';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Roles(Role.GESTOR)
  getMetrics(
    @Query('startDate')
    startDate: string,

    @Query('endDate')
    endDate: string,
  ) {
    return this.dashboardService.getMetrics(startDate, endDate);
  }
}
