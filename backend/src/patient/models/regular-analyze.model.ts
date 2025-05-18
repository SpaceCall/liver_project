import { Table, Column, Model, PrimaryKey, DataType, Default, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'regularAnalyzes',
  timestamps: true,
  createdAt: 'CreatedDate',
  updatedAt: false, 
  paranoid: true,
  deletedAt: 'DeletedDate',
})
export class RegularAnalyze extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  Id: string;

  @Column(DataType.UUID)
  Patient_id: string;

  @AllowNull
  @Default('Новий аналіз')
  @Column(DataType.STRING(500))
  Header_text: string;

  @AllowNull
  @Column(DataType.STRING(500))
  Analysis_text: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  CreatedDate: Date;

  @AllowNull
  @Column(DataType.DATE)
  DeletedDate: Date;
}
