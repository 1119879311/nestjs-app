module.exports = {
    "apps": [{
        "name": "nestjs-server",
        "script": "dist/main.js", //程序入口
        "cwd": "./", //根目录
        "instances": 1,
        "error_file": "./logs/error.log", //错误输出日志
        "out_file": "./logs/out.log", //日志
        "log_date_format": "YYYY-MM-DD HH:mm Z", //日期格式
        "watch": [
            "dist", 
            "config"
        ],
        "ignore_watch": [ // 从监控目录中排除
            "node_modules",
            "logs",
            "logspm2",
            "theme",
            "build",
            "src"
        ],
        "env_development": {
            "NODE_ENV": 'development'
        },
        "env_test": {
            "NODE_ENV": 'test'
        },
        "env_production": {
            "NODE_ENV": 'production'
        }
    }]
}