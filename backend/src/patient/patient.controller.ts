import {
    Controller, Post, Body, Query, UploadedFile, UseInterceptors, Res, Req, UseGuards, Get, Param, Delete
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { ChangePatientDto } from './dtos/change-patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { diskStorage } from 'multer';

@Controller('patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Get()
    getPatients(@CurrentUser() user: any) {
        return this.patientService.getPatients(user.userId, user.isAdmin);
    }

    @Get('getPatientData')
    getPatientData(@Query('id') id: string) {
        return this.patientService.getPatientData(id);
    }
    @Post('create')
    async createPatient(@CurrentUser() user: any, @Body('name') name: string) {
        return this.patientService.createPatient(user.userId, name);
    }
    @Post('changePatientData')
    updatePatientData(@Body() body: ChangePatientDto) {
        return this.patientService.changePatientData(body);
    }

    @Get('getLiverAnalyses')
    getLiverAnalyses(@Query('id') id: string) {
        return this.patientService.getLiverAnalyses(id);
    }

    @Post('deleteLiverAnalyses')
    deleteLiverAnalysis(@Query('liver_id') liverId: string) {
        return this.patientService.deleteLiverAnalysis(liverId);
    }

    @Get('getRegularAnalyses')
    getRegularAnalyses(@Query('id') id: string) {
        return this.patientService.getRegularAnalyses(id);
    }

    @Post('deleteRegularAnalyses')
    deleteRegularAnalysis(@Query('regular_id') regularId: string) {
        return this.patientService.deleteRegularAnalysis(regularId);
    }

    @Post('analyzeLiverImage')
    analyzeLiverImage(@Body() body: any) {
        return this.patientService.analyzeLiverImage(body);
    }

    @Get('getGalleryImages')
    async getGalleryImages(@Query('id') id: string, @Res() res: Response) {
        const data = await this.patientService.getGalleryImages(id);
        return res.json(data);
    }

    @Post('addImageToGallery')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = `${Date.now()}-${file.originalname}`;
                cb(null, filename);
            }
        })
    }))
    addImageToGallery(@UploadedFile() file: Express.Multer.File, @Query('id') id: string) {
        return this.patientService.addImageToGallery(file, id);
    }

    @Post('updateLiverAnalysesHeader')
    updateLiverHeader(@Query('liver_id') liverId: string, @Body('HeaderText') HeaderText: string) {
        return this.patientService.updateLiverHeader(liverId, HeaderText);
    }

    @Post('updateRegularAnalysesHeader')
    updateRegularHeader(@Query('regular_id') regularId: string, @Body('HeaderText') HeaderText: string) {
        return this.patientService.updateRegularHeader(regularId, HeaderText);
    }

    @Post('updateLiverAnalysesText')
    updateLiverText(@Query('liver_id') liverId: string, @Body() body) {
        return this.patientService.updateLiverText(liverId, body.AnalysisText, body.Type);
    }

    @Post('updateRegularAnalysesText')
    updateRegularText(@Query('regular_id') regularId: string, @Body('AnalysisText') text: string) {
        return this.patientService.updateRegularText(regularId, text);
    }

    @Post('updateLiverAnalysesImage')
    updateLiverImage(@Body() body, @Query('liver_id') liverId: string, @Query('patient_id') patientId: string) {
        return this.patientService.updateLiverImage(body.file, liverId, patientId);
    }

    @Post('createLiverAnalyses')
    createLiver(@Query('id') id: string) {
        return this.patientService.createLiverAnalysis(id);
    }

    @Post('createRegularAnalyses')
    createRegular(@Query('id') id: string) {
        return this.patientService.createRegularAnalysis(id);
    }

    @Post('deleteImageFromGallery')
    deleteImageFromGallery(@Query('id') id: string, @Body('fileName') fileName: string) {
        return this.patientService.deleteImageFromGallery(id, fileName);
    }

    @Delete(':id')
    removeOrUnlink(@Req() req, @Param('id') id: string) {
        return this.patientService.unlinkUserOrDeletePatient(id, req.user.userId);
    }
}
