import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateAvailabilityDto {
  @IsUUID()
  professionalId!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  weekDay!: number;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;
}
