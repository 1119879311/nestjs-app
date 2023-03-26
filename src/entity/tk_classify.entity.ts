
import { Column, CreateDateColumn, Entity,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { tk_common } from "./tk_common";

/**
 * 实体
 */
@Entity("tk_classify")
export class tk_classify extends tk_common{
  

    @Column({unique:true,comment:'tab名称',nullable:false})  // 唯一
    name:string

    @Column({type:'int',default:0,comment:"上级pid"})
    pid:number

    @Column({type:'int',comment:'状态：1是启用，其他是禁用'})
    status:number

   

}
