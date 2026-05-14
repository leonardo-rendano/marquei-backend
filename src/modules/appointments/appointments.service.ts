import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppointmentStatus } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { ServicesService } from '../services/services.service';
import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repository: AppointmentsRepository,
    private readonly usersService: UsersService,
    private readonly professionalsService: ProfessionalsService,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: any) {
    const client = await this.usersService.findById(dto.clientId);

    await this.professionalsService.findById(dto.professionalId);

    const service = await this.servicesService.findById(dto.serviceId);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const startAt = new Date(dto.startAt);

    if (startAt <= new Date()) {
      throw new BadRequestException('Agendamento precisa ser futuro');
    }

    const endAt = new Date(startAt.getTime() + service.duration * 60000);

    const conflict = await this.repository.hasConflict(
      dto.professionalId,
      startAt,
      endAt,
    );

    if (conflict) {
      throw new BadRequestException('Horário indisponível');
    }

    return this.repository.create({
      startAt,
      endAt,
      status: AppointmentStatus.CONFIRMED,

      client: {
        connect: {
          id: dto.clientId,
        },
      },

      professional: {
        connect: {
          id: dto.professionalId,
        },
      },

      service: {
        connect: {
          id: dto.serviceId,
        },
      },
    });
  }

  findAll() {
    return this.repository.findAll();
  }

  findMy(clientId: string) {
    return this.repository.findByClient(clientId);
  }

  async cancel(id: string) {
    const appointment = await this.repository.findById(id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return this.repository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });
  }

  async complete(id: string) {
    const appointment = await this.repository.findById(id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return this.repository.update(id, {
      status: AppointmentStatus.COMPLETED,
    });
  }
}
