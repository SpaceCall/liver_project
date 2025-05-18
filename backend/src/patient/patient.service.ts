import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from './models/patient.model';
import { LiverAnalyze } from './models/liver-analyze.model';
import { RegularAnalyze } from './models/regular-analyze.model';
import { ChangePatientDto } from './dtos/change-patient.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserPatient } from './models/user-patient.model';
import { User } from '../user/models/user.model';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';


@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    @InjectModel(LiverAnalyze) private liverModel: typeof LiverAnalyze,
    @InjectModel(RegularAnalyze) private regularModel: typeof RegularAnalyze,
    @InjectModel(UserPatient) private userPatientModel: typeof UserPatient,
    @InjectModel(User) private userModel: typeof User,
  ) { }
  async updatePatientData(body: { id: string, name: string, age: number, height: number, weight: number }) {
    const { id, name, age, height, weight } = body;
    return this.patientModel.update({ Name: name, Age: age, Height: height, Weight: weight }, { where: { Id: id } });
  }

  async getPatients(userId: string, isAdmin: boolean) {
    if (isAdmin) {
      return this.patientModel.findAll({
        attributes: ['Id', 'Name', 'CreatedDate'],
        order: [['CreatedDate', 'DESC']],
      });
    }

    const links = await this.userPatientModel.findAll({
      where: { Users_id: userId },
      attributes: ['Patients_id'],
      raw: true,
    });

    const ids = links.map(r => r.Patients_id);

    if (ids.length === 0) return [];

    return this.patientModel.findAll({
      where: { Id: ids },
      attributes: ['Id', 'Name', 'CreatedDate'],
      order: [['CreatedDate', 'DESC']],
    });
  }

  async getPatientData(id: string) {
    return await this.patientModel.findOne({
      where: { Id: id },
      attributes: ['Id', 'Name', 'Age', 'Height', 'Weight'],
      raw: true,
    });
  }

  async createPatient(userId: string, name: string) {
    const patient = await this.patientModel.create({ Name: name });

    await this.userPatientModel.create({
      Id: uuidv4(),
      Users_id: userId,
      Patients_id: patient.Id,
    });

    return { id: patient.Id };
  }

  async changePatientData(dto: ChangePatientDto) {
    const field = dto.change;
    const value = dto[field];
    return this.patientModel.update({ [field]: value }, { where: { Id: dto.patient_id } });
  }

  async getLiverAnalyses(id: string) {
    return this.liverModel.findAll({
      where: { Patient_id: id },
      attributes: ['Id', 'Type', 'Filename', 'Analysis_text_head', 'Analysis_text_body', 'Header_text', 'CreatedDate', 'Sensor'],
      raw: true,
    });
  }

  async getRegularAnalyses(id: string) {
    return this.regularModel.findAll({
      where: { Patient_id: id },
      attributes: ['Id', 'Analysis_text', 'Header_text', 'CreatedDate'],
      raw: true,
    });
  }

  async deleteLiverAnalysis(id: string) {
    return this.liverModel.destroy({ where: { Id: id } });
  }

  async deleteRegularAnalysis(id: string) {
    return this.regularModel.destroy({ where: { Id: id } });
  }

  async analyzeLiverImage({ liver_id, patient_id, type, sensor }) {
    const liver = await this.liverModel.findOne({ where: { Id: liver_id }, raw: true });
  
    if (!liver?.Filename) throw new Error('Файл зображення не знайдено');
  
    const filePath = path.join('/app/imagesdb', patient_id, 'analysesImages', liver.Filename);
    if (!fs.existsSync(filePath)) throw new Error(`Файл не існує: ${filePath}`);
  
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const response = await axios.post('http://model:3070/analyzeImage', {
      type,
      sensor,
      image: base64Image,
    });
    const head = response.data[0].join('\n');
    const body = response.data[1].join('\n');
  
    await this.liverModel.update({
      Analysis_text_head: type === '1' ? body : head,
      Analysis_text_body: type === '1' ? '' : body,
      Type: type,
      Sensor: sensor,
    }, { where: { Id: liver_id } });
  
    return { Analysis_text_head: head, Analysis_text_body: body };
  }

  async getGalleryImages(patientId: string) {
    const dir = path.join('/app/imagesdb', patientId, 'originals');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(dir);
    return { images: files };
  }

  async addImageToGallery(file: Express.Multer.File, patientId: string) {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    const dest = path.join('/app/imagesdb', patientId, 'originals', fileName);

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    fs.copyFileSync(file.path, dest);
    fs.unlinkSync(file.path);

    return { fileName };
  }
  async deleteImageFromGallery(patientId: string, fileName: string) {
    const filePath = path.join('/app/imagesdb', patientId, 'originals', fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return { message: 'Image deleted' };
  }

  async updateLiverHeader(id: string, header: string) {
    return this.liverModel.update({ Header_text: header }, { where: { Id: id } });
  }

  async updateRegularHeader(id: string, header: string) {
    return this.regularModel.update({ Header_text: header }, { where: { Id: id } });
  }

  async updateLiverText(id: string, text: string, type: string) {
    return this.liverModel.update({ Analysis_text: text, Type: type }, { where: { Id: id } });
  }

  async updateRegularText(id: string, text: string) {
    return this.regularModel.update({ Analysis_text: text }, { where: { Id: id } });
  }

  async updateLiverImage(fileBase64: string, liverId: string, patientId: string) {
    const dir = path.join('/app/imagesdb', patientId, 'analysesImages');
    fs.mkdirSync(dir, { recursive: true });
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}.png`;
    const fullPath = path.join(dir, fileName);
    fs.writeFileSync(fullPath, fileBase64.replace(/^data:image\/png;base64,/, ''), 'base64');
    await this.liverModel.update({ Filename: fileName }, { where: { Id: liverId } });
    return { fileName };
  }

  async createLiverAnalysis(patientId: string) {
    const analysis = await this.liverModel.create({ Patient_id: patientId });
    return { analysisId: analysis.Id };
  }

  async createRegularAnalysis(patientId: string) {
    const analysis = await this.regularModel.create({ Patient_id: patientId });
    return { analysisId: analysis.Id };
  }

  async unlinkUserOrDeletePatient(patientId: string, userId: string) {
    const links = await this.userPatientModel.findAll({
      where: { Patients_id: patientId },
    });
  
    if (links.length <= 1) {
      await this.userPatientModel.destroy({
        where: { Patients_id: patientId },
      });
  
      await this.patientModel.destroy({
        where: { Id: patientId },
      });
  
      return { message: 'Пацієнт і всі звʼязки видалені' };
    }
  
    await this.userPatientModel.destroy({
      where: { Patients_id: patientId, Users_id: userId },
    });
  
    return { message: 'Доступ до пацієнта видалено' };
  }
}
