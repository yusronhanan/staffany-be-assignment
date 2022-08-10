import { Server } from '@hapi/hapi';
import * as shiftPublishedController from './shiftPublishedController';
import { publishShiftDto, findShiftPublishedByYearWeekDto } from '../../../shared/dtos';

export default function (server: Server, basePath: string) {
    server.route({
        method: "GET",
        path: basePath,
        handler: shiftPublishedController.find,
        options: {
            description: 'Get shifts published with filter',
            notes: 'Get all shifts published if filter is not specified.',
            tags: ['api', 'shift-published']
        }
    });

    server.route({
        method: "GET",
        path: basePath + "/year-week/{year}/{week}",
        handler: shiftPublishedController.findByYearWeek,
        options: {
            description: 'Get shift published published by year week',
            notes: 'Get shift published by year week',
            tags: ['api', 'shift-published'],
            validate: {
                params: findShiftPublishedByYearWeekDto
            },
        }
    });

    server.route({
        method: "POST",
        path: basePath,
        handler: shiftPublishedController.create,
        options: {
            description: 'Set shifts as published',
            notes: 'Set shifts as published',
            tags: ['api', 'shift-published'],
            validate: {
                payload: publishShiftDto
            },
        }
    });

}