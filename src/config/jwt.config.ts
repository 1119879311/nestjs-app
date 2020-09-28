import {registerAs} from "@nestjs/config"
export default registerAs('JwtConfig',()=>({
    secret:process.env.JWT_SECRET_KEY,
    expiresIn:process.env.JWT_expiresIn
}))