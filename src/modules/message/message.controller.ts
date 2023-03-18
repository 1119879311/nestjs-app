import { Controller, Get, Query, Body, Post, Res } from '@nestjs/common';
import { NoAuth } from '@/shared/decorators/noAuth.decorators';
import { SavaMessageDto } from './dto/index.dto';
import { MessageService } from './message.service';
import {Response} from "express"
import { dataFormat, signRonder } from '@/shared/util';
@Controller('message')
export class MessageController {
    constructor(
        private readonly  messageService:MessageService
    ){}

    @Get()
    @NoAuth("ALL")
    async findList(@Query() data:any){
        return this.messageService.findList(data)
    }

    @Post('save')
    @NoAuth("ALL")
    async save(@Body() data:SavaMessageDto){
        return this.messageService.save(data)
    }

    @Get('exportExce')
    async exportExce(@Query() data:any,@Res() res:Response){
        let resBuffer = await this.messageService.exportExce(data)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        let fileName = dataFormat(new Date(),"yyyy-MM-dd")+signRonder(5) +'.xlsx'
        res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
        res.end(resBuffer, 'binary');
        // return this.messageService.exportExce(data)
    }
}
