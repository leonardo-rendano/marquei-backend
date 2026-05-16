import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppointmentsService } from './appointments.service';

import { Roles } from '../../common/decorators/roles.decorator';

import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @Roles(Role.CLIENTE)
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('my/:clientId')
  findMy(@Param('clientId') clientId: string) {
    return this.service.findMy(clientId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  @Patch(':id/complete')
  @Roles(Role.PROFISSIONAL)
  complete(@Param('id') id: string) {
    return this.service.complete(id);
  }

  @Get('slots/:professionalId')
  getSlots(
    @Param('professionalId')
    professionalId: string,

    @Query('date')
    date: string,

    @Query('serviceId')
    serviceId: string,
  ) {
    return this.service.getAvailableSlots(professionalId, date, serviceId);
  }

  @Get('professional/me')
  @Roles(Role.PROFISSIONAL)
  findMyProfessionalSchedule(@Req() req: any) {
    return this.service.findMyProfessionalSchedule(req.user.id);
  }

  @Patch(':id/no-show')
  @Roles(Role.PROFISSIONAL)
  noShow(@Param('id') id: string) {
    return this.service.noShow(id);
  }

  @Get('client/me')
  @Roles(Role.CLIENTE)
  findMyClientAppointments(@Req() req: any) {
    return this.service.findMy(req.user.id);
  }
}
