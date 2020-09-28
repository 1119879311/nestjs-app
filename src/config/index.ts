import JwtConfig from "./jwt.config"
import MysqlConfig from "./mysql.config"
const GloadConfig = ()=>({

    port:parseInt(process.env.PORT, 10) || 3000,

    password_secret:'password_secret', //密码加密密钥

    code_expiresIn:"24h",//图形验证码有效时间

    // 全局默认分页配置
})

const AppConfig = [GloadConfig,JwtConfig,MysqlConfig]

export default AppConfig;
