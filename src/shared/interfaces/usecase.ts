import { IErrorResponse, ISuccessResponse } from "./response";

export interface IEitherDataOrFailure<T> {
    data?: T;
    error?: string;
}