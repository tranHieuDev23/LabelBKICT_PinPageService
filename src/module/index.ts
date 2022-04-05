import { Container } from "brandi";
import * as pinnedPage from "./pinned_page";

export * from "./pinned_page";

export function bindToContainer(container: Container): void {
    pinnedPage.bindToContainer(container);
}
