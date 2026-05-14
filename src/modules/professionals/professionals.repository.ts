import { Injectable } from '@nestjs/common';
import { Prisma, Professional } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class ProfessionalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProfessionalCreateInput): Promise<Professional> {
    return this.prisma.professional.create({
      data,
      include: {
        user: true,
      },
    });
  }

  findAll(): Promise<Professional[]> {
    return this.prisma.professional.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: string, data: Prisma.ProfessionalUpdateInput) {
    return this.prisma.professional.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  delete(id: string) {
    return this.prisma.professional.delete({
      where: { id },
    });
  }
}
