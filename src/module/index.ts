import { Container } from "brandi";
import * as pinnedPage from "./pinned_page";
import * as s3Migration from "./s3_migration";

export * from "./pinned_page";
export * from "./s3_migration";

export function bindToContainer(container: Container): void {
    pinnedPage.bindToContainer(container);
    s3Migration.bindToContainer(container);
}
