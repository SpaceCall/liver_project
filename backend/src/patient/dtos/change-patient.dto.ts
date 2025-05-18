import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class ChangePatientDto {
  @IsUUID()
  patient_id: string;

  @IsString()
  change: string;

  @IsOptional()
  @IsString()
  Name?: string;

  @IsOptional()
  @IsNumber()
  Age?: number;

  @IsOptional()
  @IsNumber()
  Height?: number;

  @IsOptional()
  @IsNumber()
  Weight?: number;
}
