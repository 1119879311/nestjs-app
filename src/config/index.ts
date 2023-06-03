
import DbConfig from "./mysql.config"
const AppConfig = ()=>({
    NODE_ENV:process.env.NODE_ENV,
    
    port:parseInt(process.env.PORT, 10) || 3000,

    password_secret:'password_secret', //密码加密密钥

    code_expiresIn:process.env.code_expiresIn,//图形验证码有效时间

    // 全局默认分页配置
    page:process.env.page_current, //默认第一个页
    offset:process.env.page_offset, //每一页多少条

    upload_path:process.env.upload_path||'/theme/upload',

 
    // jwt 签名配置
    JwtConfig:{
        secret:process.env.JWT_SECRET_KEY,
        expiresIn:process.env.JWT_expiresIn,
    },

    // 数据库配置
    DbConfig:DbConfig(),

    // 缓存key
     cacheUserTime:parseInt(process.env.cacheUserTime), // 用户基本信息缓存有效期
     cacheRoleTime:parseInt(process.env.cacheRoleTime),// 用户角色信息缓存有效期
     cacheAnthTime:parseInt(process.env.cacheAnthTime),// 用户角色权限信息缓存有效期
     cacheTenantTime:parseInt(process.env.cacheTenantTime),// 用户分组空间信息缓存有效期


})

export type IAppConfig = ReturnType< typeof AppConfig>
export default [AppConfig];
