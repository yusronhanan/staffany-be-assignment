import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as shiftPublishedRepository from "../database/default/repository/shiftPublishedRepository";
import { FindConditions, FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IEitherDataOrFailure, IPayloadIsClashing, IUpdateShift } from "../shared/interfaces";
import { ErrMessage } from "../shared/constant";
import ShiftPublished from "../database/default/entity/shift_published";
import { EStatusShiftPublished } from "../shared/enum";
export const find = async (opts: FindManyOptions<Shift>): Promise<IEitherDataOrFailure<Shift[]>> => {
  try {
    let _shifts = await shiftRepository.find(opts)
    return { data: _shifts, error: null };
  } catch (error) {
    console.log(`Error at shiftUsecase, find(): ${error}`)
    return { data: null, error: ErrMessage.ErrInvalidResponse }
  }

};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<IEitherDataOrFailure<Shift>> => {
  try {
    let _shift = await shiftRepository.findById(id, opts);
    return { data: _shift, error: null };
  } catch (error) {
    console.log(`Error at shiftUsecase, findById(): ${error}`)
    return { data: null, error: ErrMessage.ErrInvalidResponse }
  }
};

export const create = async (payload: ICreateShift): Promise<IEitherDataOrFailure<Shift>> => {
  if (await isPublished(payload.date)) {
    return { error: ErrMessage.ErrWeekShiftAlreadyPublished, data: null }
  }

  const payloadIsClashing: IPayloadIsClashing = {
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime
  }
  if (+getDate(payload.startTime) > +getDate(payload.endTime)) {
    return { error: ErrMessage.ErrTimeRangeIsInvalid, data: null }
  }

  if (await isClashing(payloadIsClashing)) {
    return { error: ErrMessage.ErrShiftClashing, data: null }
  }

  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;
  shift.yearWeek = convertToYearWeek(payload.date);
  let _shift = await shiftRepository.create(shift)
  return { data: _shift, error: null };
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<IEitherDataOrFailure<Shift>> => {



  let existingShift = await shiftRepository.findById(id, null);
  if (existingShift == null) {
    return { error: ErrMessage.ErrNotFound, data: null }
  }

  if (await isPublished(existingShift.date)) {
    return { error: ErrMessage.ErrShiftAlreadyPublished, data: null }
  }
  const updatedStartTime = payload.startTime ?? existingShift.startTime
  const updatedEndTime = payload.endTime ?? existingShift.endTime


  if (updatedStartTime > updatedEndTime) {
    return { error: ErrMessage.ErrTimeRangeIsInvalid, data: null }
  }

  const payloadIsClashing: IPayloadIsClashing = {
    date: payload.date ?? existingShift.date,
    startTime: updatedStartTime,
    endTime: updatedEndTime,
  }

  if (await isClashing(payloadIsClashing, id)) {
    return { error: ErrMessage.ErrShiftClashing, data: null }
  }

  let updatedYearWeek: string = null;
  if (payload.date != null) {
    updatedYearWeek = convertToYearWeek(payload.date);
  }

  let _shift = await shiftRepository.updateById(id, {
    ...payload,
  },
    updatedYearWeek,
  )
  return { data: _shift, error: null };
};

export const deleteById = async (id: string | string[]): Promise<IEitherDataOrFailure<any>> => {
  if (Array.isArray(id)) {
    for (let i = 0; i < id.length; i++) {
      let existingShift = await shiftRepository.findById(id[i], null);
      if (existingShift == null) {
        return { error: ErrMessage.ErrNotFound, data: null }
      }
      if (await isPublished(existingShift.date)) {
        return { error: ErrMessage.ErrShiftAlreadyPublished, data: null }
      }
    }
  } else {
    let existingShift = await shiftRepository.findById(id, null);
    if (existingShift == null) {
      return { error: ErrMessage.ErrNotFound, data: null }
    }
    if (await isPublished(existingShift.date)) {
      return { error: ErrMessage.ErrShiftAlreadyPublished, data: null }
    }
  }
  let _deleteResult = await shiftRepository.deleteById(id)
  return { data: _deleteResult, error: null };
};

const getDate = (time: string): Date => {
  var today = new Date();
  var _t = time.split(":");
  today.setHours(Number(_t[0]), Number(_t[1]), 0, 0);
  return today;
}
/**
 * Check if shift is clashing with existing shifts.
 * If clashing then return true, otherwise false.
 */
const isClashing = async (payload: IPayloadIsClashing, id?: string): Promise<Boolean> => {
  let opts: FindManyOptions<Shift> = {
    where: {
      date: payload.date
    }
  }
  if (+getDate(payload.startTime) > +getDate(payload.endTime)) {
    return true
  }
  let existingShifts = await shiftRepository.find(opts)

  if (existingShifts.length == 0) {
    return false;
  }
  let _isClashing = false

  for (let i = 0; i < existingShifts.length && !_isClashing; i++) {
    const _shift = existingShifts[i];
    if (id != null && _shift.id == id) {
      continue
    }
    _isClashing = (+getDate(_shift.startTime) < +getDate(payload.endTime)) && (+getDate(payload.startTime) < +getDate(_shift.endTime))
  }

  return _isClashing;
}
/**
 * Check if shift is already published.
 * If already published or date is invalid then return true, otherwise false.
 */
const isPublished = async (date: string): Promise<Boolean> => {
  const yearWeek = convertToYearWeek(date)

  if (yearWeek == "") {
    return true
  }

  let opts: FindConditions<ShiftPublished> = {
    yearWeek: yearWeek,
    status: EStatusShiftPublished.PUBLISHED
  }
  let existingPublishedShift = await shiftPublishedRepository.findOne(opts);

  return existingPublishedShift != null
}
/**
 * Convert date to year week format [YYYY/WW].
 * If convertable return the converted data, empty string otherwise.
 */
const convertToYearWeek = (date: string): string => {
  try {
    let d = new Date(date)
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((Number(d) - Number(yearStart)) / 86400000) + 1) / 7);
    const yearWeek = `${d.getFullYear()}/${weekNo}`;
    return yearWeek;
  } catch (error) {
    console.log(`Error at convertToYearWeek(): ${error}`);
    return "";
  }
}