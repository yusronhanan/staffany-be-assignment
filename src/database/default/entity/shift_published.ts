import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";
import { EStatusShiftPublished } from "../../../shared/enum/shift_published";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
export default class ShiftPublished extends BaseTimestamp {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index("idx_shift_published_year_week")
    @Column()
    yearWeek: string;

    @Column({
        type: 'enum',
        enum: EStatusShiftPublished,
        default: EStatusShiftPublished.PUBLISHED
    })
    status: EStatusShiftPublished;
}
