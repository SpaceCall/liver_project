import { IsEmail, IsOptional, IsUUID, Length, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 300)
  FIO?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @Length(6, 100)
  Password?: string;

  @IsOptional()
  @IsUUID()
  DepartmentId?: string;

  @IsOptional()
  @IsUUID()
  PositionId?: string;

  @IsOptional()
  @IsBoolean()
  IsOnline?: boolean;

}
