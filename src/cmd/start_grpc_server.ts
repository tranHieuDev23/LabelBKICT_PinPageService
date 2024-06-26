import { Container } from "brandi";
import dotenv from "dotenv";
import * as utils from "../utils";
import * as config from "../config";
import * as db from "../dataaccess/db";
import * as s3 from "../dataaccess/s3";
import * as modules from "../module";
import * as service from "../service";

export function startGRPCServer(dotenvPath: string) {
    dotenv.config({
        path: dotenvPath,
    });

    const container = new Container();
    utils.bindToContainer(container);
    config.bindToContainer(container);
    db.bindToContainer(container);
    s3.bindToContainer(container);
    modules.bindToContainer(container);
    service.bindToContainer(container);

    const server = container.get(service.PIN_PAGE_SERVICE_GRPC_SERVER_TOKEN);
    server.loadProtoAndStart("./src/proto/service/pin_page_service.proto");
}
