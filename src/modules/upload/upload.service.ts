import { BadRequestException, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs"
import { dataFormat, getFileType, signRonder } from "src/common/util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
    constructor(
        private configService:ConfigService,
    ){}
    async article(files:any[],body){
        if(!body.type){
            throw new BadRequestException("data type is required")
        }
        if(!files.length){
            throw new BadRequestException("files  is not empty")
        }
        // let saveDirPath = path.join(process.cwd(),staticPath,body.type)
        // await mkdirSync(saveDirPath)
        let staticPath = this.configService.get("upload_path")
        console.log(staticPath)
        let result:string[] = []
        for (const file of files) {
            console.log("file",file)
            let fileTypeDir = getFileType(file.mimetype||'');
            let year = dataFormat(new Date(),'yyyy')
            let saveDirPath = path.join(process.cwd(),staticPath,fileTypeDir,year);//绝对路径
            await mkdirSync(saveDirPath)
            let fileName = `${body.type}${dataFormat(new Date(),'yyyy-MM-dd')}${signRonder(8)}-${file.originalname}`;//文件名：类型+日期+随机数(8)+文件名
            fs.createWriteStream(path.join(saveDirPath, fileName)).write(file.buffer)
            result.push(path.join(staticPath,fileTypeDir,year,fileName).replace(/\\/g,'/'));//返回相对路径
        }
        return result
    }

   
}

async function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (await mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true
        }
    }
  }

