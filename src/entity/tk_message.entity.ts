import { Column, CreateDateColumn, Entity,  PrimaryGeneratedColumn } from "typeorm";
import { tk_common } from "./tk_common";

@Entity("tk_message")
export class tk_message extends tk_common{
  
    @Column({comment:'邮箱'})
    email:string

    @Column({comment:'号码',nullable:true})
    telephone:string

    @Column({comment:'内容',nullable:true})
    content:string

    @Column({comment:'姓名',nullable:true})
    username:string

    @Column({comment:'地址',nullable:true})
    address:string

    @Column({comment:'公司/组织',nullable:true})
    company:string

}