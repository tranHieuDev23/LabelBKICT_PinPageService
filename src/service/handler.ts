import { injected, token } from "brandi";
import { sendUnaryData, status } from "@grpc/grpc-js";
import { ErrorWithStatus } from "../utils";
import { PinPageServiceHandlers } from "../proto/gen/PinPageService";
import {
    PinnedPageManagementOperator,
    PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN,
} from "../module/pinned_page";

export class PinPageServiceHandlersFactory {
    constructor(
        private readonly pinnedPageManagementOperator: PinnedPageManagementOperator
    ) {}

    public getPinPageServiceHandlers(): PinPageServiceHandlers {
        const handler: PinPageServiceHandlers = {
            CreatePinnedPage: async (call, callback) => {
                throw new Error("Function not implemented.");
            },
            DeletePinnedPage: async (call, callback) => {
                throw new Error("Function not implemented.");
            },
            GetPinnedPage: async (call, callback) => {
                throw new Error("Function not implemented.");
            },
            GetPinnedPageList: async (call, callback) => {
                throw new Error("Function not implemented.");
            },
            UpdatePinnedPage: async (call, callback) => {
                throw new Error("Function not implemented.");
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
