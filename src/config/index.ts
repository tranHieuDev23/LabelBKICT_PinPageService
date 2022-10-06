import { Container } from "brandi";
import { APPLICATION_CONFIG_TOKEN } from "./application";
import { ExportServiceConfig, EXPORT_SERVICE_CONFIG_TOKEN } from "./config";
import { DATABASE_CONFIG_TOKEN } from "./database";
import { DISTRIBUTED_CONFIG_TOKEN } from "./distributed";
import { GRPC_SERVER_CONFIG } from "./grpc_service";
import { LOG_CONFIG_TOKEN } from "./log";

export * from "./log";
export * from "./database";
export * from "./grpc_service";
export * from "./application";
export * from "./distributed";
export * from "./elasticsearch";
export * from "./config";

export function bindToContainer(container: Container): void {
    container.bind(EXPORT_SERVICE_CONFIG_TOKEN).toInstance(ExportServiceConfig.fromEnv).inSingletonScope();
    container
        .bind(LOG_CONFIG_TOKEN)
        .toInstance(() => container.get(EXPORT_SERVICE_CONFIG_TOKEN).logConfig)
        .inSingletonScope();
    container
        .bind(DATABASE_CONFIG_TOKEN)
        .toInstance(() => container.get(EXPORT_SERVICE_CONFIG_TOKEN).databaseConfig)
        .inSingletonScope();
    container
        .bind(GRPC_SERVER_CONFIG)
        .toInstance(() => container.get(EXPORT_SERVICE_CONFIG_TOKEN).grpcServerConfig)
        .inSingletonScope();
    container
        .bind(DISTRIBUTED_CONFIG_TOKEN)
        .toInstance(() => container.get(EXPORT_SERVICE_CONFIG_TOKEN).distributedConfig)
        .inSingletonScope();
    container
        .bind(ELASTICSEARCH_CONFIG_TOKEN)
        .toInstance(() => container.get(MODEL_SERVICE_CONFIG_TOKEN).elasticsearchConfig)
        .inSingletonScope();
    container
        .bind(APPLICATION_CONFIG_TOKEN)
        .toInstance(() => container.get(EXPORT_SERVICE_CONFIG_TOKEN).applicationConfig)
        .inSingletonScope();
}
