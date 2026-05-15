import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppointmentStatus } from '@prisma/client';

import { AvailabilityService } from '../availability/availability.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';
import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repository: AppointmentsRepository,
    private readonly usersService: UsersService,
    private readonly professionalsService: ProfessionalsService,
    private readonly servicesService: ServicesService,
    private readonly availabilityService: AvailabilityService,
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

  async getAvailableSlots(
    professionalId: string,
    date: string,
    serviceId: string,
  ) {
    const service = await this.servicesService.findById(serviceId);

    const [year, month, day] = date.split('-').map(Number);

    const selectedDate = new Date(year, month - 1, day);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const weekDay = selectedDate.getDay();

    const availabilities =
      await this.availabilityService.findByProfessional(professionalId);

    const availability = availabilities.find(
      (item) => item.weekDay === weekDay,
    );

    if (!availability) {
      return [];
    }

    const appointments = await this.repository.findByProfessionalAndDate(
      professionalId,
      startOfDay,
      endOfDay,
    );

    const slots: string[] = [];

    const [startHour, startMinute] = availability.startTime
      .split(':')
      .map(Number);

    const [endHour, endMinute] = availability.endTime.split(':').map(Number);

    const current = new Date(selectedDate);

    current.setHours(startHour, startMinute, 0, 0);

    const endBoundary = new Date(selectedDate);

    endBoundary.setHours(endHour, endMinute, 0, 0);

    while (current < endBoundary) {
      const slotStart = new Date(current);

      const slotEnd = new Date(current.getTime() + service.duration * 60000);

      const hasConflict = appointments.some(
        (appointment) =>
          slotStart < appointment.endAt && slotEnd > appointment.startAt,
      );

      const isPast = slotStart < new Date();

      if (!hasConflict && !isPast && slotEnd <= endBoundary) {
        slots.push(
          slotStart.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        );
      }

      current.setMinutes(current.getMinutes() + service.duration);
    }

    return slots;
  }
}
