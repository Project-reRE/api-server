import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { Transform } from 'class-transformer'

@Entity('movies')
export class MovieEntity {

    @PrimaryColumn( { type: 'varchar', unique: true, length: 20 })
    id: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    provider: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    name: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    nameOrg: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    prodYear: number;

    @Column({ type: 'varchar', unique: true, length: 45 })
    poster: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    genre: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    director: string;

    @Column({ type: 'varchar', unique: true, length: 45 })
    actor: string;

    @Column({ type: 'json'})
    resData: string;
    
    @CreateDateColumn()
    @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
    createdDate: Date
}
