import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Role } from '@prisma/client';

import { Roles } from '../../common/decorators/roles.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.GESTOR)
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @Roles(Role.GESTOR, Role.PROFISSIONAL, Role.CLIENTE)
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @Roles(Role.GESTOR, Role.PROFISSIONAL, Role.CLIENTE)
  findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.GESTOR)
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.GESTOR)
  delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
