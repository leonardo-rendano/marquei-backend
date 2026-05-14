import { Injectable } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        client: true,
        professional: true,
        service: true,
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  findByClient(clientId: string) {
    return this.prisma.appointment.findMany({
      where: { clientId },
      include: {
        professional: true,
        service: true,
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async hasConflict(professionalId: string, startAt: Date, endAt: Date) {
    const count = await this.prisma.appointment.count({
      where: {
        professionalId,
        status: {
          not: 'CANCELLED',
        },
        startAt: {
          lt: endAt,
        },
        endAt: {
          gt: startAt,
        },
      },
    });

    return count > 0;
  }
}
