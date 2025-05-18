import { IsEmail, IsNotEmpty, IsOptional, IsUUID, Length, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 300)
  FIO: string;

  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @Length(6, 100)
  Password: string;

  @IsOptional()
  @IsUUID()
  DepartmentId?: string;

  @IsOptional()
  @IsUUID()
  PositionId?: string;

  @IsOptional()
  @IsBoolean()
  IsAdmin?: boolean;
}
