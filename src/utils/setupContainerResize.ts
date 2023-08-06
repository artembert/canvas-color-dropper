import {onContainerResize} from "./onContainerResize.ts";
import {ISize} from "../types.ts";

export const setupContainerResize = (containerDivElement: HTMLDivElement, updateStageSizes: (sizes: ISize) => void) => {
    onContainerResize(containerDivElement, options => {
        if (options.width && options.height) {
            updateStageSizes(options)
        }
    });
};

