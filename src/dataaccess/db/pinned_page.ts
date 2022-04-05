import { status } from "@grpc/grpc-js";
import { injected, token } from "brandi";
import { Knex } from "knex";
import { Logger } from "winston";
import { ErrorWithStatus, LOGGER_TOKEN } from "../../utils";
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
    getPinnedPage(id: number): Promise<PinnedPage | null>;
    getPinnedPageWithXLock(id: number): Promise<PinnedPage | null>;
    updatePinnedPage(pinnedPage: PinnedPage): Promise<void>;
    deletePinnedPage(id: number): Promise<void>;
    withTransaction<T>(
        executeFunc: (dataAccessor: PinnedPageDataAccessor) => Promise<T>
    ): Promise<T>;
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
        try {
            const rows = await this.knex
                .insert({
                    [ColNamePinPageServicePinnedPageOfUserId]: args.ofUserId,
                    [ColNamePinPageServicePinnedPagePinTime]: args.pinTime,
                    [ColNamePinPageServicePinnedPageURL]: args.url,
                    [ColNamePinPageServicePinnedPageScreenshotFilename]:
                        args.screenshotFilename,
                    [ColNamePinPageServicePinnedPageDescription]:
                        args.screenshotFilename,
                })
                .returning([ColNamePinPageServicePinnedPagePinnedPageId])
                .into(TabNamePinPageServicePinnedPage);
            return +rows[0][ColNamePinPageServicePinnedPagePinnedPageId];
        } catch (error) {
            this.logger.error("failed to create pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async getPinnedPageCount(ofUserId: number): Promise<number> {
        try {
            const rows = await this.knex
                .count()
                .from(TabNamePinPageServicePinnedPage)
                .where({
                    [ColNamePinPageServicePinnedPageOfUserId]: ofUserId,
                });
            return +(rows[0] as any)["count"];
        } catch (error) {
            this.logger.error("failed to create pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async getPinnedPageList(
        ofUserId: number,
        offset: number,
        limit: number
    ): Promise<PinnedPage[]> {
        try {
            const rows = await this.knex
                .select()
                .from(TabNamePinPageServicePinnedPage)
                .where({ [ColNamePinPageServicePinnedPageOfUserId]: ofUserId })
                .offset(offset)
                .limit(limit)
                .orderBy(ColNamePinPageServicePinnedPagePinTime, "desc");
            return rows.map((row) => this.getPinnedPageFromRow(row));
        } catch (error) {
            this.logger.error("failed to get pinned page list", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async getPinnedPage(id: number): Promise<PinnedPage | null> {
        try {
            const rows = await this.knex
                .select()
                .from(TabNamePinPageServicePinnedPage)
                .where({ [ColNamePinPageServicePinnedPagePinnedPageId]: id });
            if (rows.length === 0) {
                this.logger.info("no pinned page with id found", {
                    pinnedPageId: id,
                });
                return null;
            }
            return this.getPinnedPageFromRow(rows[0]);
        } catch (error) {
            this.logger.error("failed to get pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async getPinnedPageWithXLock(
        id: number
    ): Promise<PinnedPage | null> {
        try {
            const rows = await this.knex
                .select()
                .from(TabNamePinPageServicePinnedPage)
                .where({ [ColNamePinPageServicePinnedPagePinnedPageId]: id })
                .forUpdate();
            if (rows.length === 0) {
                this.logger.info("no pinned page with id found", {
                    pinnedPageId: id,
                });
                return null;
            }
            return this.getPinnedPageFromRow(rows[0]);
        } catch (error) {
            this.logger.error("failed to get pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async updatePinnedPage(pinnedPage: PinnedPage): Promise<void> {
        try {
            await this.knex
                .table(TabNamePinPageServicePinnedPage)
                .update({
                    [ColNamePinPageServicePinnedPageOfUserId]:
                        pinnedPage.ofUserId,
                    [ColNamePinPageServicePinnedPagePinTime]:
                        pinnedPage.pinTime,
                    [ColNamePinPageServicePinnedPageURL]: pinnedPage.url,
                    [ColNamePinPageServicePinnedPageScreenshotFilename]:
                        pinnedPage.screenshotFilename,
                    [ColNamePinPageServicePinnedPageDescription]:
                        pinnedPage.screenshotFilename,
                })
                .where({
                    [ColNamePinPageServicePinnedPagePinnedPageId]:
                        pinnedPage.id,
                });
        } catch (error) {
            this.logger.error("failed to update pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async deletePinnedPage(id: number): Promise<void> {
        try {
            const deleteCount = await this.knex
                .delete()
                .from(TabNamePinPageServicePinnedPage)
                .where({
                    [ColNamePinPageServicePinnedPagePinnedPageId]: id,
                });
            if (deleteCount === 0) {
                this.logger.debug("no pinned page with pinned_page_id found", {
                    pinnedPageId: id,
                });
                throw new ErrorWithStatus(
                    `no pinned page with pinned_page_id ${id} found`,
                    status.NOT_FOUND
                );
            }
        } catch (error) {
            this.logger.error("failed to delete pinned page", { error });
            throw ErrorWithStatus.wrapWithStatus(error, status.INTERNAL);
        }
    }

    public async withTransaction<T>(
        executeFunc: (dataAccessor: PinnedPageDataAccessor) => Promise<T>
    ): Promise<T> {
        return this.knex.transaction(async (tx) => {
            const txDataAccessor = new PinnedPageDataAccessorImpl(
                tx,
                this.logger
            );
            return executeFunc(txDataAccessor);
        });
    }

    private getPinnedPageFromRow(row: Record<string, any>): PinnedPage {
        return new PinnedPage(
            +row[ColNamePinPageServicePinnedPagePinnedPageId],
            +row[ColNamePinPageServicePinnedPageOfUserId],
            +row[ColNamePinPageServicePinnedPagePinTime],
            row[ColNamePinPageServicePinnedPageURL],
            row[ColNamePinPageServicePinnedPageScreenshotFilename],
            row[ColNamePinPageServicePinnedPageDescription]
        );
    }
}

injected(PinnedPageDataAccessorImpl, KNEX_INSTANCE_TOKEN, LOGGER_TOKEN);

export const PINNED_PAGE_DATA_ACCESSOR_TOKEN = token<PinnedPageDataAccessor>(
    "PinnedPageDataAccessor"
);
