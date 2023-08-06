import {ISize} from "../types.ts";

export const convertSizeToCssString = (size: ISize): string => {
    return `width: ${size.width}px; height: ${size.height}px;`
}