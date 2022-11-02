import { Container } from "brandi";
import { IMAGE_PROCESSOR_TOKEN, ImageProcessorImpl } from "./image_processor";
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
    container
        .bind(IMAGE_PROCESSOR_TOKEN)
        .toInstance(ImageProcessorImpl)
        .inSingletonScope();
}
