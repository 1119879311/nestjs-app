const mysql  = require("mysql2")
const path = require("path")
const fs = require("fs")

loadEnv()
function loadEnv (){

}

/**
 *  获取mysql 配置
 * @returns {object}
 */
const getConfig = ()=>{
    return {
        name: 'default',
        type:"mysql",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        charset: process.env.DB_CHARSER,
    }
}

/**
 * 
 */
class DbModel{

    constructor(config){
        this.pool = mysql.createPool(config)
    }

    /**
     * 
     * @param {*} SQL 
     * @param {*} data 
     * @returns 
     */
    async exec(SQL, data = []) {
        return new Promise((resolve,reject) => {
            this.pool.getConnection((conErr, sqlCom) => {
                if (conErr) {
                    reject()
                    console.error(`Connection  Fail：` + conErr, "error")
                }
                 sqlCom.query(SQL, data, (qErr, res) => {
                    sqlCom.release();
                    if (qErr) {
                        console.error(`SQL  Error: 【 ${SQL} 】  ` + qErr, "error")
                        reject()
                    }
                    resolve(res)
                })
            })
        })

    }



}


function getDbVersion(){
    const enteryDir = path.resolve(__dirname, 'version')
    let versionFiles = fs.readdirSync(enteryDir);
    

    console.log(versionFiles,enteryDir)
}



async function init(){
    const dbConfig = getConfig()
    const db = new DbModel(dbConfig)

    const dbVersion = getDbVersion()
}

init()
