import * as shiftPublishedRepository from "../database/default/repository/shiftPublishedRepository";
import { FindConditions, FindManyOptions, FindOneOptions } from "typeorm";
import ShiftPublished from "../database/default/entity/shift_published";
import { IEitherDataOrFailure, IPublishShift } from "../shared/interfaces";
import { EStatusShiftPublished } from "../shared/enum";
import { ErrMessage } from "../shared/constant";

export const find = async (opts: FindManyOptions<ShiftPublished>): Promise<IEitherDataOrFailure<ShiftPublished[]>> => {
    try {
        const _shiftsPublished = await shiftPublishedRepository.find(opts);
        return { data: _shiftsPublished, error: null }
    } catch (error) {
        console.log(`Error at shiftPublishedUsecase, find(): ${error}`)
        return { data: null, error: ErrMessage.ErrInvalidResponse }
    }

};

export const findByYearWeek = async (
    yearWeek: string,
    opts?: FindConditions<ShiftPublished>
): Promise<IEitherDataOrFailure<ShiftPublished>> => {
    try {
        opts = { yearWeek: yearWeek }
        const _shiftPublished = await shiftPublishedRepository.findOne(opts);
        return { data: _shiftPublished, error: null }
    } catch (error) {
        console.log(`Error at shiftPublishedUsecase, findByYearWeek(): ${error}`)
        return { data: null, error: ErrMessage.ErrInvalidResponse }
    }
};

export const publishShift = async (payload: IPublishShift): Promise<IEitherDataOrFailure<ShiftPublished>> => {
    let opts: FindConditions<ShiftPublished> = {
        yearWeek: payload.yearWeek,
        status: EStatusShiftPublished.PUBLISHED,
    }
    let existingPublishedShift = await shiftPublishedRepository.findOne(opts);
    if (existingPublishedShift != null) {
        return { error: ErrMessage.ErrShiftAlreadyPublished, data: null }
    }
    const shiftPublished = new ShiftPublished();
    shiftPublished.yearWeek = payload.yearWeek
    shiftPublished.status = EStatusShiftPublished.PUBLISHED
    let _shiftPublished = await shiftPublishedRepository.create(shiftPublished)
    return { data: _shiftPublished, error: null };
};


