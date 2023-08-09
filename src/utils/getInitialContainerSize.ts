import { ISize } from "../types.ts";

export const callInitialContainerSize = (
  container: HTMLDivElement,
  callback: (params: ISize) => void,
) => {
  const sizes = container.getBoundingClientRect();

  if (sizes) {
    callback({ width: sizes.width, height: sizes.height });
  }
};
