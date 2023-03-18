import { UploadService } from './upload.service';
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {Permissions} from "src/shared/decorators/permissions.decorators"
// import { NoAuth } from '@/shared/decorators/noAuth.decorators';

@Controller('upload')
export class UploadController {

    constructor(
        private uploadService:UploadService
    ){}

    @Post()
    @Permissions("per-upload")
    @UseInterceptors(FilesInterceptor('files'))
     async article(@UploadedFiles() files,@Body() body) {
         return this.uploadService.article(files,body)
    }
}