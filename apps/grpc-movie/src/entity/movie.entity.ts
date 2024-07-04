import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { Transform } from 'class-transformer'

@Entity('movie')
export class MovieEntity {

    @PrimaryColumn( { type: 'varchar', unique: true, length: 20 })
    id: string;

    @Column({ type: 'varchar', length: 45 })
    provider: string;

    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column({ type: 'varchar', length: 45 })
    nameOrg: string;

    @Column({ type: 'int'})
    prodYear: number;

    @Column({ type: 'varchar', length: 256 })
    poster: string;

    @Column({ type: 'varchar', length: 128 })
    genre: string;

    @Column({ type: 'varchar', length: 128 })
    director: string;

    @Column({ type: 'varchar', length: 1000 })
    actor: string;

    @Column({ type: 'json'})
    resData: string;
    
    @CreateDateColumn()
    @Transform(({ value }) => (typeof value !== 'string' ? value?.toISOString() : value))
    createdDate: Date
}
