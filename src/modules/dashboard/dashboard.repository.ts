import { Injectable } from '@nestjs/common';

import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countAppointments(startDate: Date, endDate: Date) {
    return this.prisma.appointment.count({
      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async countCompletedAppointments(startDate: Date, endDate: Date) {
    return this.prisma.appointment.count({
      where: {
        status: AppointmentStatus.COMPLETED,

        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async countNoShowAppointments(startDate: Date, endDate: Date) {
    return this.prisma.appointment.count({
      where: {
        status: AppointmentStatus.NO_SHOW,

        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async estimatedRevenue(startDate: Date, endDate: Date) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETED,

        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      include: {
        service: true,
      },
    });

    return appointments.reduce(
      (total, appointment) => total + appointment.service.price,

      0,
    );
  }

  async mostRequestedServices(startDate: Date, endDate: Date) {
    return this.prisma.appointment.groupBy({
      by: ['serviceId'],

      where: {
        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      _count: true,

      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
    });
  }
}
