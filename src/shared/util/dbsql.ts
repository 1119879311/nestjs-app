import { isToEmpty } from ".";
import  {SqlString} from "./sqlString"
export interface Iobject {
    [key:string]:any
}
export interface IupdateMany {
    table:string
    values:Iobject|Iobject[]
    where:{key:string}
}
 /**
     * 
     * @param opt 
     * table,where,values
     * [{id:1,p_id:2,title:"title1"},{id:1,p_id:2,title:"title2"}]
     * UPDATE categories      
        SET 
        p_id = CASE id 
            WHEN 1 THEN 3 
            WHEN 2 THEN 4 
            WHEN 3 THEN 5 
        END, 
        title = CASE id 
            WHEN 1 THEN 'New Title 1'
            WHEN 2 THEN 'New Title 2'
            WHEN 3 THEN 'New Title 3'
        END
        WHERE id IN (1,2,3)
     */
    export function parseUpdateManySql(sqlOpt:IupdateMany){
        let whereKey:string[] = [];
        let whenArr:{[key:string]:any} ={};

        let values = sqlOpt.values;
        let keyField = sqlOpt.where.key;
        if(!Array.isArray(values)||!keyField||values.length<1){
            return ''
        }
        for(let i =0;i<values.length;i++){
            let vals = values[i]
            for (let key in vals) {
                if(key===keyField){ //如果是更新key
                    whereKey.push(vals[key])
                }else{
                    if(!whenArr[key]){
                        whenArr[key] = [];
                    }
                    whenArr[key].push([` when ${SqlString.escape(vals[keyField])} then  ${SqlString.escape(vals[key])} `]);
                }
            }
        }
        let whenRes:string[] = []
        for (let key in values[0]) {
            if(whenArr[key]){
                whenRes.push(  ` ${key} = case ${keyField} ${whenArr[key].join(" ")} end `  )
            }
           
        }
        return  `update ${sqlOpt.table} set ${whenRes.join(',')} where  ${keyField} in (${whereKey.join(",")})`;
    }

    export function BuildLimit(page?:number,offset?:number){
        if(isToEmpty(page)&&isToEmpty(offset)){
            return  [page*offset, Number(offset)]
        }
        if(isToEmpty(page)&&!isToEmpty(offset)){
            return [Number(page)]
        }
        return []
    }

    export class BuildWhere{
        private whereStr:string=''
        private whereData:any[]=[]
    
        /**
         * name
         */
        public getWhereStr():string {
            let res =  this.whereStr;
            return res.replace(/^\s+(AND|OR)/i,'');
        }
        /**
         * name
         */
        public getWhereData():any[] {
            return this.whereData;
        }
        andWhere(str:string,value?):this{
            this.whereStr =  this.whereStr+ ' AND ' +str;
            value&&this.whereData.push(value);
            return this;
        }
        orWhere(str,value?):this{
            this.whereStr =  this.whereStr+' OR '+str;
            value&&this.whereData.push(value);
            return this;
        }
    
    }
    
    export class BuilSql{
        
        private sql:string=''
        constructor(sql:string){
            this.sql = sql;
        }
    
        replaceField(name:string,data?:any):this{
            if(data&&data.trim()){
                this.sql= this.sql.replace(new RegExp(":"+name,'ig'),`${name} ${data} `)
            }else{
                this.sql =  this.sql.replace(new RegExp(":"+name,'ig'),'')
            }
            return this;
           
        } 
        replaceFields(nameArray:string[],data?:string[]):this{
            for(let i=0;i<nameArray.length;i++){
                this.replaceField(nameArray[i],data&&data[i])
            }
            return this;
        }
        getSql():string{
            return this.sql;
        }
    }


