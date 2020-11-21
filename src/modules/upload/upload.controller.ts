import { UploadService } from './upload.service';
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('upload')
export class UploadController {

    constructor(
        private uploadService:UploadService
    ){}

    @Post()
    @UseInterceptors(FilesInterceptor('files'))
     async article(@UploadedFiles() files,@Body() body) {
         return this.uploadService.article(files,body)
    }
}