
// 加密解密
import * as crypto from "crypto";
const AES_SECRET_KEY='AES_SECRET_KEY';

export function signRonder(n = 30){ //取随机数
    var str = "123456789aAbBcCdDeEfFgGhHiIjJkKlLmMoOpPqQurRsStTuUvVwWxXyYzZ_-";
    if ( n < 3) n = 30;
    var ronderstr = "";
    for (var i = 0; i < n; i++) {
        var index = Math.floor(Math.random() * str.length);
        ronderstr += str[index];
    }
    return ronderstr
}

export const MD5 =(data:string)=>{
    let dataKey = data.split('').reverse().join('');
    let hash = crypto.createHash("sha256")
    hash.update(data+'-'+dataKey);
    return hash.digest("hex");
}

export const Aes = {
    /**加密
     * 
     * @param dataKey 要生成加密key 的自定义datakey(解密的时候需要)
     */
    encryption:function(data:string|number,dataKey:string|number){
        try {
            data = typeof data!=="string"?data.toString():data;
            dataKey = typeof dataKey!=="string"?dataKey.toString():dataKey;
            let algorithm = 'aes-192-cbc';
            let key = crypto.scryptSync(dataKey, AES_SECRET_KEY, 24);
            let iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(algorithm,key,iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            let strIv = iv.toString("hex")
            return encrypted+'.'+strIv;
        } catch (error) {
            return null;   
        }
        
    },
    /**解密
     * 
     * @param afterData 加密后的数据
     * @param dataKey 要生成加密key 的自定义datakey(和加密的一样)
     */
    decrypt:function(afterData:string,dataKey:string|number){
        try {
            dataKey = typeof dataKey!="string"?dataKey.toString():dataKey;
            let algorithm = 'aes-192-cbc';
            let [value,iv] = afterData.split('.');
            let ivBuffer = Buffer.from(iv,'hex');
            let key = crypto.scryptSync(dataKey, AES_SECRET_KEY, 24);
            const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
            let decrypted = decipher.update(value, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted
        } catch (error) {
            
            return null;   
        }
    }
}

// 时间换算 毫秒： 如 "1s"=1000ms,1m=1s*60,1h=1m*60
/**
 * 
 * @param time 简写： 秒："1s",分："1m" 时： "10h", 天： "7d" 月："1M"    年： "1Y"
 */
export function TimeTranform(time:string|number){
    if(typeof time==='number') return time
    
   
    let date = Number(time.substr(0,time.length-1))
    if(isNaN(date)){
        throw new Error("time 参数有误")
    }
    let timeType = time.substr(time.length-1,1)
    let second = 1000;//这是1秒
    let minute = second*60; //1分钟
    let houer = minute*60  //小时
    let days = houer*24// 天
    let resData:string|number = 0
    switch (timeType) {
        case "s"://秒
            resData = date*second;
            break;
        case "m"://分
            resData = date*minute;
            break;
        case "h": //时
            resData = date*houer;
            break;
        case "d": //天
             resData = date*days;
            break;
        case "M": //月 // 一个月具体不知道多少天，以当前月有多少天为标准
             resData = date*days*getCountDays();
            break;
        case "Y": //年
            let year = new Date().getFullYear();
            let yearDay =  year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)?366:365;
            resData = date*days*yearDay;
            break;
        default:
            resData = time
            break;
    }
    return resData;


    
}
//获取当前月有多少天
function getCountDays() {
    var curDate = new Date();
/* 获取当前月份 */
  var curMonth = curDate.getMonth()+1;
/*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  curDate.setMonth(curMonth);
  /* 将日期设置为0,*/
  curDate.setDate(0);
  /* 返回当月的天数 */
  return curDate.getDate();
}

//递归法：一维数组转无限极树状结构
/**
 *
 * @param data 数据源，一维数据
 * @param idKeys 要匹配所在项的唯一idkey 属性字段，比如idkeys ='id',
 * @param pidKeys 要匹配所在项的上级 pidkey 属性字段，比如pidkeys = 'pid',
 * @param pid  要匹配所在项目的上级pidkey 字段的值,比如 pid = 0
 * @param leve 当前所在树状结构的层级数
 */
export function oneToTree<T extends {[key:string]:any}>(data:T[],idKeys?:string,pidKeys?:string,pid?:any,leve?:number){
    let idKey = idKeys||"id"
    let pidKey = pidKeys||'pid'
    let leveKey = "$leve"
    let childrenKey = "children"
    let pidData = pid||0
    let leves = leve||1;
    if(!Array.isArray(data)) return data;
    type resI = T&{$leve:number,children:resI[]};//使用交叉类型，新增了两个字段$live,children
    let resArr:Array<resI> =[];
    data.forEach( (itme:any)=> {
        if (itme[pidKey] === pidData) {
            itme[leveKey] = leves;
            itme[childrenKey] = oneToTree(data, idKey, pidKey, itme[idKey], leves + 1);
            resArr.push(itme)
        }
    })

    return resArr

}

export function filterObject<T extends {[key:string]:any}>(data:T,keys?:(keyof T)[]|keyof T){
    let res:any = {};
    for (const key in data) {
        let val = data[key]
        if((val!==''&&val!==null&&val!==undefined)||key===keys){
            res[key] =data[key] 
        }
    }
    return res
}
export function isToEmpty(val:any){
    return (val!==''&&val!==null&&val!==undefined)
}

export  let dataFormat=  (date:number|Date, format ="yyyy-MM-dd hh:mm:ss"):string =>{//参数一:时间，参数，要显示的时间格式
    if(!date) return '';
    date = new Date(date);
    if (Object.prototype.toString.call(date) !== "[object Date]") return '';
    var o = {
        "M+": date.getMonth() + 1,                 //月份 
        "d+": date.getDate(),                    //日 
        "h+": date.getHours(),                   //小时 
        "m+": date.getMinutes(),                 //分 
        "s+": date.getSeconds(),                 //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {

            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? ((o as any )[k]) : (("00" + (o as any)[k]).substr(("" + (o as any)[k]).length)));
        }
    }
    return format;
}

/**
 * 
 * @param mimetype 文件分类
 */
export function getFileType(mimetype){

    if(/^image\/.*/.test(mimetype)){
        return "images"
    }
    if(/^video\/.*/.test(mimetype)){
        return "videos"
    }
    if(/^audio\/.*/.test(mimetype)){
        return "audios"
    }
    return "files"
}

export function getClientIp(req){
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip']||req.ip
}



