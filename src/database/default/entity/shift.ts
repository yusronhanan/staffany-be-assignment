import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
export default class Shift extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "date",
  })
  date: string;

  @Column({
    type: "time",
  })
  startTime: string;

  @Column({
    type: "time",
  })
  endTime: string;

  @Index("idx_shift_year_week")
  @Column()
  yearWeek: string;
}
