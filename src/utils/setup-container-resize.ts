import { ISize } from "../types.ts";
import { onContainerResize } from "./on-container-resize.ts";

export const setupContainerResize = (
  containerDivElement: HTMLDivElement,
  updateStageSizes: (sizes: ISize) => void,
) => {
  onContainerResize(containerDivElement, (options) => {
    if (options.width && options.height) {
      updateStageSizes(options);
    }
  });
};
