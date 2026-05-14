import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '@prisma/client';

import { ProfessionalsRepository } from './professionals.repository';
import { UsersService } from '../users/users.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    private readonly repository: ProfessionalsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateProfessionalDto) {
    if (!dto.userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const user = await this.usersService.findById(dto.userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.role !== Role.PROFISSIONAL) {
      throw new BadRequestException('Usuário precisa ser PROFISSIONAL');
    }

    return this.repository.create({
      specialty: dto.specialty,
      user: {
        connect: { id: dto.userId },
      },
    });
  }

  findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const professional = await this.repository.findById(id);

    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return professional;
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
