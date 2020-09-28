
// 加密解密
import * as crypto from "crypto";
const AES_SECRET_KEY='AES_SECRET_KEY';

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
            // console.log(error)
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
            // console.log(error)
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

