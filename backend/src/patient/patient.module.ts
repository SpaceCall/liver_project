import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient } from './models/patient.model';
import { LiverAnalyze } from './models/liver-analyze.model';
import { RegularAnalyze } from './models/regular-analyze.model';
import { UserPatient } from './models/user-patient.model';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Patient, LiverAnalyze, RegularAnalyze, UserPatient, User])],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
