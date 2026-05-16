import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

import { BadRequestException } from '@nestjs/common';

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
        professional: {
          include: {
            user: true,
          },
        },
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
      include: {
        client: true,
        professional: {
          include: {
            user: true,
          },
        },
        service: true,
      },
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

  findByProfessionalAndDate(
    professionalId: string,
    startOfDay: Date,
    endOfDay: Date,
  ) {
    return this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: {
          not: 'CANCELLED',
        },
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  async createWithTransaction(data: {
    clientId: string;
    professionalId: string;
    serviceId: string;
    startAt: Date;
    endAt: Date;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const conflict = await tx.appointment.findFirst({
          where: {
            professionalId: data.professionalId,

            status: {
              not: 'CANCELLED',
            },

            startAt: {
              lt: data.endAt,
            },

            endAt: {
              gt: data.startAt,
            },
          },
        });

        if (conflict) {
          throw new BadRequestException('Horário indisponível');
        }

        return tx.appointment.create({
          data: {
            startAt: data.startAt,
            endAt: data.endAt,

            status: AppointmentStatus.CONFIRMED,

            client: {
              connect: {
                id: data.clientId,
              },
            },

            professional: {
              connect: {
                id: data.professionalId,
              },
            },

            service: {
              connect: {
                id: data.serviceId,
              },
            },
          },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );
  }

  findByProfessionalUserId(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        professional: {
          userId,
        },
      },
      include: {
        client: true,
        professional: {
          include: {
            user: true,
          },
        },
        service: true,
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  markNoShow(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'NO_SHOW',
      },
      include: {
        client: true,
        professional: {
          include: {
            user: true,
          },
        },
        service: true,
      },
    });
  }
}
