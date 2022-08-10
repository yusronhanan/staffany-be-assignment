import { Request, ResponseToolkit } from "@hapi/hapi";
import * as shiftUsecase from "../../../usecases/shiftUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateShift,
  IEitherDataOrFailure,
  ISuccessResponse,
  IUpdateShift,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("shiftController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shifts");
  try {
    const filter = req.query;
    const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftUsecase.find(filter);
    if (eitherDataOrFailure.error != null) {
      throw new Error(eitherDataOrFailure.error);
    }
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: eitherDataOrFailure.data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const findById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shift by id");
  try {
    const id = req.params.id;
    const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftUsecase.findById(id);
    if (eitherDataOrFailure.error != null) {
      throw new Error(eitherDataOrFailure.error);
    }
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: eitherDataOrFailure.data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create shift");
  try {
    const body = req.payload as ICreateShift;
    const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftUsecase.create(body);
    if (eitherDataOrFailure.error != null) {
      throw new Error(eitherDataOrFailure.error);
    }
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Create shift successful",
      results: eitherDataOrFailure.data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const updateById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Update shift by id");
  try {
    const id = req.params.id;
    const body = req.payload as IUpdateShift;

    const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftUsecase.updateById(id, body);
    if (eitherDataOrFailure.error != null) {
      throw new Error(eitherDataOrFailure.error);
    }
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Update shift successful",
      results: eitherDataOrFailure.data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const deleteById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Delete shift by id");
  try {
    const id = req.params.id;
    const eitherDataOrFailure: IEitherDataOrFailure<any> = await shiftUsecase.deleteById(id);
    if (eitherDataOrFailure.error != null) {
      throw new Error(eitherDataOrFailure.error);
    }
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Delete shift successful",
      results: eitherDataOrFailure.data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};
