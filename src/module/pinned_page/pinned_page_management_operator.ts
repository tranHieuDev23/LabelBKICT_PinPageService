import { injected, token } from "brandi";
import { Logger } from "winston";
import validator from "validator";
import { PinnedPageDataAccessor, PINNED_PAGE_DATA_ACCESSOR_TOKEN } from "../../dataaccess/db";
import { PinnedPage } from "../../proto/gen/PinnedPage";
import { ErrorWithStatus, IdGenerator, ID_GENERATOR_TOKEN, LOGGER_TOKEN, Timer, TIMER_TOKEN } from "../../utils";
import { status } from "@grpc/grpc-js";
import { ImageProcessor, IMAGE_PROCESSOR_TOKEN } from "./image_processor";
import { BucketDM, SCREENSHOT_S3_DM_TOKEN } from "../../dataaccess/s3";

export interface PinnedPageManagementOperator {
    createPinnedPage(ofUserId: number, url: string, description: string, screenshotData: Buffer): Promise<PinnedPage>;
    getPinnedPageList(
        ofUserId: number,
        offset: number,
        limit: number
    ): Promise<{ totalPinnedPageCount: number; pinnedPageList: PinnedPage[] }>;
    getPinnedPage(id: number): Promise<PinnedPage>;
    updatePinnedPage(id: number, description: string | undefined): Promise<PinnedPage>;
    deletePinnedPage(id: number): Promise<void>;
}

const SCREENSHOT_WIDTH = 320;
const SCREENSHOT_HEIGHT = 180;

export class PinnedPageManagementOperatorImpl implements PinnedPageManagementOperator {
    constructor(
        private readonly pinnedPageDM: PinnedPageDataAccessor,
        private readonly screenshotS3DM: BucketDM,
        private readonly imageProcessor: ImageProcessor,
        private readonly idGenerator: IdGenerator,
        private readonly timer: Timer,
        private readonly logger: Logger
    ) {}

    public async createPinnedPage(
        ofUserId: number,
        url: string,
        description: string,
        screenshotData: Buffer
    ): Promise<PinnedPage> {
        const requestTime = this.timer.getCurrentTime();
        description = this.sanitizeDescription(description);
        const processedScreenshot = await this.imageProcessor.resizeImage(
            screenshotData,
            SCREENSHOT_WIDTH,
            SCREENSHOT_HEIGHT
        );
        const screenshotFileName = await this.generateScreenshotFileName(requestTime);
        await this.screenshotS3DM.uploadFile(screenshotFileName, processedScreenshot);
        const pinnedPageId = await this.pinnedPageDM.createPinnedPage({
            ofUserId: ofUserId,
            pinTime: requestTime,
            url: url,
            description: description,
            screenshotFilename: screenshotFileName,
        });
        return {
            id: pinnedPageId,
            ofUserId: ofUserId,
            pinTime: requestTime,
            url: url,
            description: description,
            screenshotFilename: screenshotFileName,
        };
    }

    private async generateScreenshotFileName(uploadTime: number): Promise<string> {
        return `screenshot-${uploadTime}-${await this.idGenerator.generate()}.jpeg`;
    }

    public async getPinnedPageList(
        ofUserId: number,
        offset: number,
        limit: number
    ): Promise<{ totalPinnedPageCount: number; pinnedPageList: PinnedPage[] }> {
        const dmResults = await Promise.all([
            this.pinnedPageDM.getPinnedPageCount(ofUserId),
            this.pinnedPageDM.getPinnedPageList(ofUserId, offset, limit),
        ]);
        const totalPinnedPageCount = dmResults[0];
        const pinnedPageList = dmResults[1];
        return { totalPinnedPageCount, pinnedPageList };
    }

    public async getPinnedPage(id: number): Promise<PinnedPage> {
        const pinnedPage = await this.pinnedPageDM.getPinnedPage(id);
        if (pinnedPage === null) {
            this.logger.error("no pinned page with the provided id found", {
                pinnedPageId: id,
            });
            throw new ErrorWithStatus(`no pinned page with id ${id} found`, status.NOT_FOUND);
        }
        return pinnedPage;
    }

    public async updatePinnedPage(id: number, description: string | undefined): Promise<PinnedPage> {
        if (description !== undefined) {
            description = this.sanitizeDescription(description);
        }
        return this.pinnedPageDM.withTransaction(async (pinnedPageDM) => {
            const pinnedPage = await pinnedPageDM.getPinnedPageWithXLock(id);
            if (pinnedPage === null) {
                this.logger.error("no pinned page with the provided id found", {
                    pinnedPageId: id,
                });
                throw new ErrorWithStatus(`no pinned page with id ${id} found`, status.NOT_FOUND);
            }
            if (description !== undefined) {
                pinnedPage.description = description;
            }
            await pinnedPageDM.updatePinnedPage(pinnedPage);
            return pinnedPage;
        });
    }

    public async deletePinnedPage(id: number): Promise<void> {
        await this.pinnedPageDM.deletePinnedPage(id);
    }

    private sanitizeDescription(description: string): string {
        return validator.escape(description.trim());
    }
}

injected(
    PinnedPageManagementOperatorImpl,
    PINNED_PAGE_DATA_ACCESSOR_TOKEN,
    SCREENSHOT_S3_DM_TOKEN,
    IMAGE_PROCESSOR_TOKEN,
    ID_GENERATOR_TOKEN,
    TIMER_TOKEN,
    LOGGER_TOKEN
);

export const PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN =
    token<PinnedPageManagementOperator>("PinnedPageManagementOperator");
