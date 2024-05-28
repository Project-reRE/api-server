import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    provider: string;

    @Column()
    name: string;

    @Column()
    nameOrg: string;

    @Column()
    prodYear: number;

    @Column()
    poster: string;

    @Column()
    genre: string;

    @Column()
    director: string;

    @Column()
    actor: string;

    @Column()
    resData: JSON;
    
    @Column()
    createDate: Date;
}
