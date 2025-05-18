import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    Unique,
    BelongsTo, 
    ForeignKey,
    BelongsToMany
} from 'sequelize-typescript';
import { Department } from '../../department/models/department.model';
import { Position } from '../../position/models/position.model';
import { Patient } from '../../patient/models/patient.model';
import { UserPatient } from '../../patient/models/user-patient.model';

@Table({
    tableName: 'users',
    timestamps: true,                          
    paranoid: true,                             
  })
export class User extends Model<User> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    Id: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(300) })
    FIO: string;

    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING(50) })
    Email: string;

    @AllowNull(false)
    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    IsAdmin: boolean;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    Hash: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    Salt: string;

    @AllowNull(true)
    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    IsOnline: boolean;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    LastOnline: Date;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID })
    DepartmentId: string;

    @BelongsTo(() => Department)
    Department: Department;

    @ForeignKey(() => Position)
    @Column({ type: DataType.UUID })
    PositionId: string;

    @BelongsTo(() => Position)
    Position: Position;

    @BelongsToMany(() => Patient, () => UserPatient)
    Patients: Patient[];

}
