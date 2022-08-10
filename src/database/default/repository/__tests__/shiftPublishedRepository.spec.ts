import * as typeorm from "typeorm";
import * as shiftPublishedRepository from "../shiftPublishedRepository";
import ShiftPublished from "../../entity/shift_published";
import { EStatusShiftPublished } from "../../../../shared/enum";

describe("shiftPublishedRepository => find", () => {
    it("find => passed", async () => {
        const expectedData = new ShiftPublished();
        expectedData.status = EStatusShiftPublished.PUBLISHED;
        expectedData.yearWeek = "2022/32";

        const getRepositorySpy = jest
            .spyOn(typeorm, "getRepository")
            .mockReturnValue({
                find: jest.fn().mockResolvedValue([expectedData]),
            } as any);

        const result = await shiftPublishedRepository.find();

        expect(result).toEqual([expectedData]);
        expect(getRepositorySpy).toHaveBeenNthCalledWith(1, ShiftPublished);
        expect(typeorm.getRepository(ShiftPublished).find).toHaveBeenCalledTimes(1);
    });
});

describe("shiftPublishedRepository => findOne by id", () => {
    it("findOne by id => passed", async () => {
        const id = "0000-0000-000-000";

        const expectedData = new ShiftPublished();
        expectedData.id = id;
        expectedData.status = EStatusShiftPublished.PUBLISHED;
        expectedData.yearWeek = "2022/32";

        const getRepositorySpy = jest
            .spyOn(typeorm, "getRepository")
            .mockReturnValue({
                findOne: jest.fn().mockResolvedValue(expectedData),
            } as any);

        const result = await shiftPublishedRepository.findOne({
            id: id,
        });

        expect(result).toEqual(expectedData);
        expect(getRepositorySpy).toHaveBeenNthCalledWith(1, ShiftPublished);
        expect(typeorm.getRepository(ShiftPublished).findOne).toHaveBeenNthCalledWith(
            1,
            { id },
            undefined
        );
    });
});

describe("shiftPublishedRepository => findOne by year week", () => {
    it("findOne by year week => passed", async () => {
        const id = "0000-0000-000-000";
        const yearWeek = "2022/32";
        const expectedData = new ShiftPublished();
        expectedData.id = id;
        expectedData.status = EStatusShiftPublished.PUBLISHED;
        expectedData.yearWeek = yearWeek;

        const getRepositorySpy = jest
            .spyOn(typeorm, "getRepository")
            .mockReturnValue({
                findOne: jest.fn().mockResolvedValue(expectedData),
            } as any);

        const result = await shiftPublishedRepository.findOne({
            yearWeek: yearWeek,
        });

        expect(result).toEqual(expectedData);
        expect(getRepositorySpy).toHaveBeenNthCalledWith(1, ShiftPublished);
        expect(typeorm.getRepository(ShiftPublished).findOne).toHaveBeenNthCalledWith(
            1,
            { yearWeek },
            undefined
        );
    });
});

describe("shiftPublishedRepository => create", () => {
    it("create => passed", async () => {
        const payload = new ShiftPublished();
        payload.status = EStatusShiftPublished.PUBLISHED;
        payload.yearWeek = "2022/32";

        const expectedResult = {
            id: "0000-0000-0000-0000",
            status: EStatusShiftPublished.PUBLISHED,
            yearWeek: "2022/32",
        };

        const getRepositorySpy = jest
            .spyOn(typeorm, "getRepository")
            .mockReturnValue({
                save: jest.fn().mockResolvedValue(expectedResult),
            } as any);

        const result = await shiftPublishedRepository.create(payload);

        expect(result).toEqual(expectedResult);
        expect(getRepositorySpy).toHaveBeenNthCalledWith(1, ShiftPublished);
        expect(typeorm.getRepository(ShiftPublished).save).toHaveBeenNthCalledWith(
            1,
            payload
        );
    });
});
