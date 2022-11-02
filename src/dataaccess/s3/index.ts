import { Container } from "brandi";
import { MINIO_CLIENT_TOKEN, newMinioClient } from "./minio";
import { initializeOriginalImageS3DM, SCREENSHOT_S3_DM_TOKEN } from "./screenshot";

export * from "./bucket_dm";
export * from "./screenshot";

export function bindToContainer(container: Container): void {
    container.bind(MINIO_CLIENT_TOKEN).toInstance(newMinioClient).inSingletonScope();
    container.bind(SCREENSHOT_S3_DM_TOKEN).toInstance(initializeOriginalImageS3DM).inSingletonScope();
}
