import { token } from "brandi";

export class ApplicationConfig {
    public screenshotDir = "screenshots";

    public static fromEnv(): ApplicationConfig {
        const config = new ApplicationConfig();
        if (process.env.PIN_PAGE_SERVICE_SCREENSHOT_DIR !== undefined) {
            config.screenshotDir = process.env.PIN_PAGE_SERVICE_SCREENSHOT_DIR;
        }
        return config;
    }
}

export const APPLICATION_CONFIG_TOKEN =
    token<ApplicationConfig>("ApplicationConfig");
