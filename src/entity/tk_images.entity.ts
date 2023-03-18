import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



/**
 * 用户实体
 */
@Entity("tk_images")
export class tk_images{
    @PrimaryGeneratedColumn({comment:'id'})
    id:number

    @Column({nullable:true,comment:'标题'})  // 唯一
    title:string

    @Column({nullable:true,comment:'简述'})  // 唯一
    remark:string

    @Column({nullable:false,comment:'图片'})
    urls:string

    @Column({nullable:true,comment:'分类'})
    cid:string

    @Column({type:'int',default:10,unique:false,comment:'排序'})
    sort:number

    @Column({type:'int',default:1,unique:false,comment:'状态：1是启用，其他是禁用'})
    status:number

    @CreateDateColumn({comment:'创建时间'})
    createtime:string

    @UpdateDateColumn({ comment: '更新时间' })   //自动生成并自动更新列
    updatetime: string

    
}
