import { Table, Column, Model, PrimaryKey, DataType, Default,ForeignKey } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Patient } from './patient.model';
@Table({
  tableName: 'users_patients',
  timestamps: true,
  createdAt: 'CreatedDate',
  updatedAt: false, 
  paranoid: true,
  deletedAt: 'DeletedDate',
})
export class UserPatient extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  Id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  Users_id: string;

  @ForeignKey(() => Patient)
  @Column(DataType.UUID)
  Patients_id: string;


  @Default(DataType.NOW)
  @Column(DataType.DATE)
  CreatedDate: Date;

  @Column(DataType.DATE)
  DeletedDate: Date;
}
