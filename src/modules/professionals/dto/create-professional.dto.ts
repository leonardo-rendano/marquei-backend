import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProfessionalDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}
