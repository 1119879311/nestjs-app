import {Response} from "express"
import { Controller, Get, Query, Body, Post, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { dataFormat, signRonder } from '@/shared/util';
import { SavaMessageDto } from './message.dto';
import { Auth } from '@/shared/decorators/authorization.decorator';
@Controller('message')
export class MessageController {
    constructor(
        private readonly  messageService:MessageService
    ){}

    @Get()

    async findList(@Query() data:any){
        return this.messageService.findList(data)
    }

    @Post('save')
  
    async save(@Body() data:SavaMessageDto){
        return this.messageService.save(data)
    }

    @Get('exportExce')
    @Auth()
    async exportExce(@Query() data:any,@Res() res:Response){
        let resBuffer = await this.messageService.exportExce(data)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        let fileName = dataFormat(new Date(),"yyyy-MM-dd")+signRonder(5) +'.xlsx'
        res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
        res.end(resBuffer, 'binary');
        // return this.messageService.exportExce(data)
    }
}
