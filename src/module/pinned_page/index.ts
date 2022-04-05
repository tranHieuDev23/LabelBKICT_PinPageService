import { Container } from "brandi";
import {
    PinnedPageManagementOperatorImpl,
    PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN,
} from "./pinned_page_management_operator";

export * from "./pinned_page_management_operator";

export function bindToContainer(container: Container): void {
    container
        .bind(PINNED_PAGE_MANAGEMENT_OPERATOR_TOKEN)
        .toInstance(PinnedPageManagementOperatorImpl)
        .inSingletonScope();
}
