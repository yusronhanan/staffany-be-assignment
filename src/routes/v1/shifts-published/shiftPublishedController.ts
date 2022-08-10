import { Request, ResponseToolkit } from "@hapi/hapi";
import * as shiftPublishedUsecase from "../../../usecases/shiftPublishedUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
    IEitherDataOrFailure,
    IPublishShift,
    ISuccessResponse,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("shiftPublishedController");

export const find = async (req: Request, h: ResponseToolkit) => {
    logger.info("Find published shifts");
    try {
        const filter = req.query;
        const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftPublishedUsecase.find(filter);
        if (eitherDataOrFailure.error != null) {
            throw new Error(eitherDataOrFailure.error);
        }
        const res: ISuccessResponse = {
            statusCode: 200,
            message: "Get published shift successful",
            results: eitherDataOrFailure.data
        };
        return res;
    } catch (error) {
        logger.error(error.message)
        return errorHandler(h, error);
    }
};

export const findByYearWeek = async (req: Request, h: ResponseToolkit) => {
    logger.info("Find published shifts by year week");
    try {
        const year = req.params.year;
        const week = req.params.week;
        const yearWeek = `${year}/${week}`;
        const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftPublishedUsecase.findByYearWeek(yearWeek);
        if (eitherDataOrFailure.error != null) {
            throw new Error(eitherDataOrFailure.error);
        }
        const res: ISuccessResponse = {
            statusCode: 200,
            message: "Get published shift by year week successful",
            results: eitherDataOrFailure.data
        };
        return res;
    } catch (error) {
        logger.error(error.message)
        return errorHandler(h, error);
    }
};

export const create = async (req: Request, h: ResponseToolkit) => {
    logger.info("Create published shift");
    try {
        const body = req.payload as IPublishShift;
        const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftPublishedUsecase.publishShift(body);
        if (eitherDataOrFailure.error != null) {
            throw new Error(eitherDataOrFailure.error);
        }
        const res: ISuccessResponse = {
            statusCode: 200,
            message: "Publish shift successful",
            results: eitherDataOrFailure.data
        };
        return res;
    } catch (error) {
        logger.error(error.message)
        return errorHandler(h, error);
    }
};