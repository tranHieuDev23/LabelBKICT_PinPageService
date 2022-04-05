import { Container } from "brandi";
import { KNEX_INSTANCE_TOKEN, newKnexInstance } from "./knex";
import {
    PinnedPageDataAccessorImpl,
    PINNED_PAGE_DATA_ACCESSOR_TOKEN,
} from "./pinned_page";

export * from "./pinned_page";

export function bindToContainer(container: Container): void {
    container
        .bind(KNEX_INSTANCE_TOKEN)
        .toInstance(newKnexInstance)
        .inSingletonScope();
    container
        .bind(PINNED_PAGE_DATA_ACCESSOR_TOKEN)
        .toInstance(PinnedPageDataAccessorImpl)
        .inSingletonScope();
}
