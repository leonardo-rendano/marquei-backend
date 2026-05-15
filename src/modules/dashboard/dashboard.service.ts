import { Injectable } from '@nestjs/common';

import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getMetrics(startDate: string, endDate: string) {
    const start = new Date(startDate);

    const end = new Date(endDate);

    const [
      totalAppointments,
      completedAppointments,
      noShowAppointments,
      estimatedRevenue,
      mostRequestedServices,
    ] = await Promise.all([
      this.repository.countAppointments(start, end),

      this.repository.countCompletedAppointments(start, end),

      this.repository.countNoShowAppointments(start, end),

      this.repository.estimatedRevenue(start, end),

      this.repository.mostRequestedServices(start, end),
    ]);

    const noShowRate =
      totalAppointments === 0
        ? 0
        : Number(((noShowAppointments / totalAppointments) * 100).toFixed(2));

    const completionRate =
      totalAppointments === 0
        ? 0
        : Number(
            ((completedAppointments / totalAppointments) * 100).toFixed(2),
          );

    return {
      totalAppointments,
      completedAppointments,
      noShowAppointments,

      noShowRate,

      completionRate,

      estimatedRevenue,

      mostRequestedServices,
    };
  }
}
