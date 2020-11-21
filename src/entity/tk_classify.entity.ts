
import { Column, CreateDateColumn, Entity,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * 实体
 */
@Entity("tk_classify")
export class tk_classify{
    @PrimaryGeneratedColumn({comment:'id'})
    id:number

    @Column({unique:true,comment:'tab名称',nullable:false})  // 唯一
    name:string

    @Column({type:'int',default:0,comment:"上级pid"})
    pid:number

    @Column({type:'int',unique:false,comment:'状态：1是启用，其他是禁用'})
    status:number

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string

}
