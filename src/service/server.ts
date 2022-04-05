import {
    loadPackageDefinition,
    Server,
    ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { injected, token } from "brandi";
import {
    PIN_PAGE_SERVICE_HANDLERS_FACTORY_TOKEN,
    PinPageServiceHandlersFactory,
} from "./handler";
import { GRPCServerConfig, GRPC_SERVER_CONFIG } from "../config";
import { ProtoGrpcType } from "../proto/gen/pin_page_service";
import { Logger } from "winston";
import { LOGGER_TOKEN } from "../utils";

export class PinPageServiceGRPCServer {
    constructor(
        private readonly handlerFactory: PinPageServiceHandlersFactory,
        private readonly grpcServerConfig: GRPCServerConfig,
        private readonly logger: Logger
    ) {}

    public loadProtoAndStart(protoPath: string): void {
        const pinPageServiceProtoGrpc =
            this.loadPinPageServiceProtoGrpc(protoPath);

        const server = new Server();
        server.addService(
            pinPageServiceProtoGrpc.PinPageService.service,
            this.handlerFactory.getPinPageServiceHandlers()
        );

        server.bindAsync(
            `127.0.0.1:${this.grpcServerConfig.port}`,
            ServerCredentials.createInsecure(),
            (error, port) => {
                if (error) {
                    this.logger.error("failed to start grpc server", { error });
                    return;
                }

                console.log(`starting grpc server, listening to port ${port}`);
                this.logger.info("starting grpc server", { port });
                server.start();
            }
        );
    }

    private loadPinPageServiceProtoGrpc(protoPath: string): ProtoGrpcType {
        const packageDefinition = loadSync(protoPath, {
            keepCase: false,
            enums: Number,
            defaults: false,
            oneofs: true,
        });
        const pinPageServicePackageDefinition = loadPackageDefinition(
            packageDefinition
        ) as unknown;
        return pinPageServicePackageDefinition as ProtoGrpcType;
    }
}

injected(
    PinPageServiceGRPCServer,
    PIN_PAGE_SERVICE_HANDLERS_FACTORY_TOKEN,
    GRPC_SERVER_CONFIG,
    LOGGER_TOKEN
);

export const PIN_PAGE_SERVICE_GRPC_SERVER_TOKEN =
    token<PinPageServiceGRPCServer>("PinPageServiceGRPCServer");
