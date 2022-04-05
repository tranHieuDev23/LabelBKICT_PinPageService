import { injected, token } from "brandi";
import { sendUnaryData, status } from "@grpc/grpc-js";
import { ErrorWithStatus } from "../utils";
import { PinPageServiceHandlers } from "../proto/gen/PinPageService";
import {
    PinnedPageManagementOperator,
    PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN,
} from "../module/pinned_page";

const DEFAULT_GET_PIN_PAGE_LIST_LIMIT = 10;

export class PinPageServiceHandlersFactory {
    constructor(
        private readonly pinnedPageManagementOperator: PinnedPageManagementOperator
    ) {}

    public getPinPageServiceHandlers(): PinPageServiceHandlers {
        const handler: PinPageServiceHandlers = {
            CreatePinnedPage: async (call, callback) => {
                const req = call.request;
                if (req.ofUserId === undefined) {
                    return callback({
                        message: "of_user_id is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                if (req.url === undefined) {
                    return callback({
                        message: "url is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                if (req.screenshotData === undefined) {
                    return callback({
                        message: "screenshot_data is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                const description = req.description || "";
                try {
                    const pinnedPage =
                        await this.pinnedPageManagementOperator.createPinnedPage(
                            req.ofUserId,
                            req.url,
                            description,
                            req.screenshotData
                        );
                    callback(null, { pinnedPage });
                } catch (e) {
                    this.handleError(e, callback);
                }
            },

            DeletePinnedPage: async (call, callback) => {
                const req = call.request;
                if (req.id === undefined) {
                    return callback({
                        message: "id is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                try {
                    await this.pinnedPageManagementOperator.deletePinnedPage(
                        req.id
                    );
                    callback(null, {});
                } catch (e) {
                    this.handleError(e, callback);
                }
            },

            GetPinnedPage: async (call, callback) => {
                const req = call.request;
                if (req.id === undefined) {
                    return callback({
                        message: "id is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                try {
                    const pinnedPage =
                        await this.pinnedPageManagementOperator.getPinnedPage(
                            req.id
                        );
                    callback(null, { pinnedPage });
                } catch (e) {
                    this.handleError(e, callback);
                }
            },

            GetPinnedPageList: async (call, callback) => {
                const req = call.request;
                if (req.ofUserId === undefined) {
                    return callback({
                        message: "of_user_id is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                const offset = req.offset || 0;
                const limit = req.limit || DEFAULT_GET_PIN_PAGE_LIST_LIMIT;
                try {
                    const { totalPinnedPageCount, pinnedPageList } =
                        await this.pinnedPageManagementOperator.getPinnedPageList(
                            req.ofUserId,
                            offset,
                            limit
                        );
                    callback(null, { totalPinnedPageCount, pinnedPageList });
                } catch (e) {
                    this.handleError(e, callback);
                }
            },

            UpdatePinnedPage: async (call, callback) => {
                const req = call.request;
                if (req.id === undefined) {
                    return callback({
                        message: "id is required",
                        code: status.INVALID_ARGUMENT,
                    });
                }
                try {
                    const pinnedPage =
                        await this.pinnedPageManagementOperator.updatePinnedPage(
                            req.id,
                            req.description
                        );
                    callback(null, { pinnedPage });
                } catch (e) {
                    this.handleError(e, callback);
                }
            },
        };
        return handler;
    }

    private handleError(e: unknown, callback: sendUnaryData<any>) {
        if (e instanceof ErrorWithStatus) {
            return callback({
                message: e.message,
                code: e.status,
            });
        } else if (e instanceof Error) {
            return callback({
                message: e.message,
                code: status.INTERNAL,
            });
        } else {
            return callback({
                code: status.INTERNAL,
            });
        }
    }
}

injected(PinPageServiceHandlersFactory, PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN);

export const PIN_PAGE_SERVICE_HANDLERS_FACTORY_TOKEN =
    token<PinPageServiceHandlersFactory>("PinPageServiceHandlersFactory");
