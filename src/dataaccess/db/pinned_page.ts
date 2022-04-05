import { injected, token } from "brandi";
import { Knex } from "knex";
import { Logger } from "winston";
import { LOGGER_TOKEN } from "../../utils";
import { KNEX_INSTANCE_TOKEN } from "./knex";

export class PinnedPage {
    constructor(
        public id: number,
        public ofUserId: number,
        public pinTime: number,
        public url: string,
        public screenshotFilename: string,
        public description: string
    ) {}
}

export interface CreatePinnedPageArgs {
    ofUserId: number;
    pinTime: number;
    url: string;
    screenshotFilename: string;
    description: string;
}

export interface PinnedPageDataAccessor {
    createPinnedPage(args: CreatePinnedPageArgs): Promise<number>;
    getPinnedPageCount(ofUserId: number): Promise<number>;
    getPinnedPageList(
        ofUserId: number,
        offset: number,
        limit: number
    ): Promise<PinnedPage[]>;
    getPinnedPage(id: number): Promise<PinnedPage>;
    getPinnedPageWithXLock(id: number): Promise<PinnedPage>;
    updatePinnedPage(pinnedPage: PinnedPage): Promise<void>;
    deletePinnedPage(id: number): Promise<void>;
}

const TabNamePinPageServicePinnedPage = "pin_page_service_pinned_page_tab";
const ColNamePinPageServicePinnedPagePinnedPageId = "pinned_page_id";
const ColNamePinPageServicePinnedPageOfUserId = "of_user_id";
const ColNamePinPageServicePinnedPagePinTime = "pin_time";
const ColNamePinPageServicePinnedPageURL = "url";
const ColNamePinPageServicePinnedPageScreenshotFilename = "screenshot_filename";
const ColNamePinPageServicePinnedPageDescription = "description";

export class PinnedPageDataAccessorImpl implements PinnedPageDataAccessor {
    constructor(
        private readonly knex: Knex<any, any[]>,
        private readonly logger: Logger
    ) {}

    public async createPinnedPage(args: CreatePinnedPageArgs): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPageCount(ofUserId: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPageList(
        ofUserId: number,
        offset: number,
        limit: number
    ): Promise<PinnedPage[]> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPage(id: number): Promise<PinnedPage> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPageWithXLock(id: number): Promise<PinnedPage> {
        throw new Error("Method not implemented.");
    }

    public async updatePinnedPage(pinnedPage: PinnedPage): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async deletePinnedPage(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

injected(PinnedPageDataAccessorImpl, KNEX_INSTANCE_TOKEN, LOGGER_TOKEN);

export const PINNED_PAGE_DATA_ACCESSOR_TOKEN = token<PinnedPageDataAccessor>(
    "PinnedPageDataAccessor"
);
