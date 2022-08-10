import Joi from 'joi';


export const publishShiftDto = Joi.object({
    yearWeek: Joi.string().required(),
});

export const findShiftPublishedByYearWeekDto = Joi.object({
    year: Joi.string().required(),
    week: Joi.string().required(),
});