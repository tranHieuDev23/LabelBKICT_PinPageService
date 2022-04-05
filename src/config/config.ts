import { token } from "brandi";
import { ApplicationConfig } from "./application";
import { DatabaseConfig } from "./database";
import { DistributedConfig } from "./distributed";
import { GRPCServerConfig } from "./grpc_service";
import { LogConfig } from "./log";

export class ExportServiceConfig {
    public logConfig = new LogConfig();
    public databaseConfig = new DatabaseConfig();
    public grpcServerConfig = new GRPCServerConfig();
    public distributedConfig = new DistributedConfig();
    public applicationConfig = new ApplicationConfig();

    public static fromEnv(): ExportServiceConfig {
        const config = new ExportServiceConfig();
        config.logConfig = LogConfig.fromEnv();
        config.databaseConfig = DatabaseConfig.fromEnv();
        config.grpcServerConfig = GRPCServerConfig.fromEnv();
        config.distributedConfig = DistributedConfig.fromEnv();
        config.applicationConfig = ApplicationConfig.fromEnv();
        return config;
    }
}

export const EXPORT_SERVICE_CONFIG_TOKEN = token<ExportServiceConfig>(
    "ExportServiceConfig"
);
