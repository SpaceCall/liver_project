import { Table, Column, Model, PrimaryKey, DataType, Default, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'liverAnalyzes',
  timestamps: true,
  createdAt: 'CreatedDate',
  updatedAt: false, 
  paranoid: true,
  deletedAt: 'DeletedDate',
})
export class LiverAnalyze extends Model {
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
  @Default(2)
  @Column(DataType.INTEGER)
  Type: number;

  @AllowNull
  @Column(DataType.STRING(20))
  Sensor: string;

  @AllowNull
  @Column(DataType.STRING(500))
  Filename: string;

  @AllowNull
  @Column(DataType.STRING(1000))
  Analysis_text_head: string;

  @AllowNull
  @Column(DataType.STRING(1000))
  Analysis_text_body: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  CreatedDate: Date;

  @AllowNull
  @Column(DataType.DATE)
  DeletedDate: Date;
}
