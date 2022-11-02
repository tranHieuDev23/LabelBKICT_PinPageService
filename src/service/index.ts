import { Container } from "brandi";
import {
    PinPageServiceHandlersFactory,
    PIN_PAGE_SERVICE_HANDLERS_FACTORY_TOKEN,
} from "./handler";
import {
    PinPageServiceGRPCServer,
    PIN_PAGE_SERVICE_GRPC_SERVER_TOKEN,
} from "./server";

export * from "./handler";
export * from "./server";

export function bindToContainer(container: Container): void {
    container
        .bind(PIN_PAGE_SERVICE_HANDLERS_FACTORY_TOKEN)
        .toInstance(PinPageServiceHandlersFactory)
        .inSingletonScope();
    container
        .bind(PIN_PAGE_SERVICE_GRPC_SERVER_TOKEN)
        .toInstance(PinPageServiceGRPCServer)
        .inSingletonScope();
}
