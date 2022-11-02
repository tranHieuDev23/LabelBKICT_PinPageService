import { token } from "brandi";

export class GRPCServerConfig {
    public port = 20004;

    public static fromEnv(): GRPCServerConfig {
        const config = new GRPCServerConfig();
        if (process.env.PIN_PAGE_SERVICE_PORT !== undefined) {
            config.port = +process.env.PIN_PAGE_SERVICE_PORT;
        }
        return config;
    }
}

export const GRPC_SERVER_CONFIG = token<GRPCServerConfig>("GRPCServerConfig");
