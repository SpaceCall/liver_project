import { Table, Column, Model, PrimaryKey, DataType, Default, AllowNull,BelongsToMany } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { UserPatient } from './user-patient.model';

@Table({
  tableName: 'patients',
  timestamps: true,
  createdAt: 'CreatedDate',
  updatedAt: false, 
  paranoid: true,
  deletedAt: 'DeletedDate',
})
export class Patient extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  Id: string;

  @Column({ type: DataType.STRING, defaultValue: 'New patient' })
  Name: string;

  @AllowNull
  @Column(DataType.INTEGER)
  Age: number;

  @AllowNull
  @Column(DataType.DOUBLE)
  Height: number;

  @AllowNull
  @Column(DataType.DOUBLE)
  Weight: number;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  CreatedDate: Date;

  @AllowNull
  @Column(DataType.DATE)
  DeletedDate: Date;

  @BelongsToMany(() => User, () => UserPatient)
  Users: User[];

}
