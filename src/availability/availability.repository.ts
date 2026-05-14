import { Injectable } from '@nestjs/common';
import { Availability, Prisma } from '@prisma/client';
import { PrismaService } from '../infra/prisma/prisma.service';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AvailabilityCreateInput): Promise<Availability> {
    return this.prisma.availability.create({
      data,
    });
  }

  findAll(): Promise<Availability[]> {
    return this.prisma.availability.findMany({
      orderBy: [{ weekDay: 'asc' }, { startTime: 'asc' }],
    });
  }

  findById(id: string) {
    return this.prisma.availability.findUnique({
      where: { id },
    });
  }

  findByProfessional(professionalId: string) {
    return this.prisma.availability.findMany({
      where: { professionalId },
      orderBy: [{ weekDay: 'asc' }, { startTime: 'asc' }],
    });
  }

  update(id: string, data: Prisma.AvailabilityUpdateInput) {
    return this.prisma.availability.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.availability.delete({
      where: { id },
    });
  }
}
