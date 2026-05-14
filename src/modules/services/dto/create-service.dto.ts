import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  duration!: number;

  @IsNumber()
  @Min(0)
  price!: number;
}
