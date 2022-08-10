import {
    getRepository,
    FindManyOptions,
    FindOneOptions,
    FindConditions,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import ShiftPublished from "../entity/shift_published";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const logger = moduleLogger("shiftRepository");

export const find = async (opts?: FindManyOptions<ShiftPublished>): Promise<ShiftPublished[]> => {
    logger.info("Find");
    const repository = getRepository(ShiftPublished);
    const data = await repository.find(opts);
    return data;
};

export const findOne = async (
    where?: FindConditions<ShiftPublished>,
    opts?: FindOneOptions<ShiftPublished>
): Promise<ShiftPublished> => {
    logger.info("Find one");
    const repository = getRepository(ShiftPublished);
    const data = await repository.findOne(where, opts);
    return data;
};

export const create = async (payload: ShiftPublished): Promise<ShiftPublished> => {
    logger.info("Create");
    const repository = getRepository(ShiftPublished);
    const newdata = await repository.save(payload);
    return newdata;
};
