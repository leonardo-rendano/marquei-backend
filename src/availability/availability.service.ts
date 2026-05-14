import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AvailabilityRepository } from './availability.repository';
import { ProfessionalsService } from '../modules/professionals/professionals.service';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly repository: AvailabilityRepository,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async create(dto: any) {
    await this.professionalsService.findById(dto.professionalId);

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime precisa ser menor que endTime');
    }

    return this.repository.create({
      weekDay: dto.weekDay,
      startTime: dto.startTime,
      endTime: dto.endTime,
      professional: {
        connect: {
          id: dto.professionalId,
        },
      },
    });
  }

  findAll() {
    return this.repository.findAll();
  }

  findByProfessional(professionalId: string) {
    return this.repository.findByProfessional(professionalId);
  }

  async findById(id: string) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException('Disponibilidade não encontrada');
    }

    return item;
  }

  async update(id: string, dto: any) {
    await this.findById(id);

    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.repository.delete(id);
  }
}
