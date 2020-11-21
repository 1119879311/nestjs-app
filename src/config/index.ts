import JwtConfig from "./jwt.config"
import MysqlConfig from "./mysql.config"
const GloadConfig = ()=>({

    port:parseInt(process.env.PORT, 10) || 3000,

    password_secret:'password_secret', //密码加密密钥

    code_expiresIn:process.env.code_expiresIn,//图形验证码有效时间

    // 全局默认分页配置
    page:process.env.page_current, //默认第一个页
    offset:process.env.page_offset, //每一页多少条

    upload_path:process.env.upload_path||'/theme/upload'
})

const AppConfig = [GloadConfig,JwtConfig,MysqlConfig]

export default AppConfig;
