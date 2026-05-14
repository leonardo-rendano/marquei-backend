import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  create(data: any) {
    return this.servicesRepository.create(data);
  }

  findAll() {
    return this.servicesRepository.findAll();
  }

  async findById(id: string) {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async update(id: string, data: any) {
    await this.findById(id);

    return this.servicesRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.servicesRepository.delete(id);
  }
}
