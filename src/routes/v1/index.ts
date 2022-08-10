import { Server } from "@hapi/hapi";
import createShiftRoutes from "./shifts";
import createShiftPublishedRoutes from "./shifts-published";


export default function (server: Server, basePath: string) {
  createShiftRoutes(server, basePath + "/shifts");
  createShiftPublishedRoutes(server, basePath + "/shifts-published");
}
