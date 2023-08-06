import {ISize} from "../../types.ts";

export const onContainerResize = (container: HTMLDivElement, callback: (params: ISize) => void) => {
    const resizeObserver = new ResizeObserver(entries => {
        window.requestAnimationFrame(() => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            const [entry] = entries;

            const {
                contentRect: {width, height},
            } = entry;

            callback({width, height});
        });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.unobserve(container);
};