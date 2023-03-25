import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class tk_common {
    
    @PrimaryGeneratedColumn({comment:'id'})
    id:number

    @Column({type:'int',comment:"操作者id"})
    operator_userid:number

    @Column({type:'int',comment:"操作者租户"})
    operator_tenant_id:number

    @Column({type:'int',default:1,comment:'状态：1是启用，其他是禁用'})
    status:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string
    
}