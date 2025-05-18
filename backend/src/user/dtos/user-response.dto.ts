import { Exclude, Expose, Type } from 'class-transformer';

class DepartmentInfo {
  @Expose()
  Name: string;
}

class PositionInfo {
  @Expose()
  Name: string;
}

export class UserResponseDto {
  @Expose()
  Id: string;

  @Expose()
  FIO: string;

  @Expose()
  Email: string;

  @Expose()
  IsAdmin: boolean;

  @Expose()
  DepartmentId: string;

  @Expose()
  PositionId: string;

  @Expose()
  @Type(() => DepartmentInfo)
  Department: DepartmentInfo;

  @Expose()
  @Type(() => PositionInfo)
  Position: PositionInfo;

  @Exclude()
  Hash: string;

  @Exclude()
  Salt: string;

  @Exclude()
  CreatedDate: Date;

  @Exclude()
  DeletedDate: Date;
}
