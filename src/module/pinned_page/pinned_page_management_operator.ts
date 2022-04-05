import { injected, token } from "brandi";
import { Logger } from "winston";
import {
    PinnedPageDataAccessor,
    PINNED_PAGE_DATA_ACCESSOR_TOKEN,
} from "../../dataaccess/db";
import { PinnedPage } from "../../proto/gen/PinnedPage";
import { LOGGER_TOKEN } from "../../utils";

export interface PinnedPageManagementOperator {
    createPinnedPage(
        ofUserId: number,
        url: string,
        description: string,
        screenshotData: Buffer
    ): Promise<PinnedPage>;
    getPinnedPageList(
        ofUserId: number
    ): Promise<{ totalPinnedPageCount: number; pinnedPageList: PinnedPage[] }>;
    getPinnedPage(id: number): Promise<PinnedPage>;
    updatePinnedPage(id: number, description: string): Promise<PinnedPage>;
    deletePinnedPage(id: number): Promise<void>;
}

export class PinnedPageManagementOperatorImpl
    implements PinnedPageManagementOperator
{
    constructor(
        private readonly pinnedPageDM: PinnedPageDataAccessor,
        private readonly logger: Logger
    ) {}

    public async createPinnedPage(
        ofUserId: number,
        url: string,
        description: string,
        screenshotData: Buffer
    ): Promise<PinnedPage> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPageList(
        ofUserId: number
    ): Promise<{ totalPinnedPageCount: number; pinnedPageList: PinnedPage[] }> {
        throw new Error("Method not implemented.");
    }

    public async getPinnedPage(id: number): Promise<PinnedPage> {
        throw new Error("Method not implemented.");
    }

    public async updatePinnedPage(
        id: number,
        description: string
    ): Promise<PinnedPage> {
        throw new Error("Method not implemented.");
    }

    public async deletePinnedPage(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

injected(
    PinnedPageManagementOperatorImpl,
    PINNED_PAGE_DATA_ACCESSOR_TOKEN,
    LOGGER_TOKEN
);

export const PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN =
    token<PinnedPageManagementOperator>("PinnedPageManagementOperator");
