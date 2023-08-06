import {useEffect, useRef} from 'react';
import {setupContainerResize} from "../../utils/setupContainerResize.ts";
import {ISize} from "../../types.ts";
import {convertSizeToCssString} from "../../utils/convert-size-to-css-string.ts";
import styles from './styles.module.css';
import {callInitialContainerSize} from "../../utils/getInitialContainerSize.ts";

type Props = {
    imageSrc?: string;
}

export const Canvas = ({imageSrc}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const devicePixelRatio = window.devicePixelRatio;

    const setCssSizes = (size: ISize) => {
        if (!canvasRef.current || !ctx.current || !imageRef.current) {
            return;
        }
        const aspectRatio = imageRef.current.width / imageRef.current.height;
        const {width, height} = {width: size.width, height: size.width / aspectRatio}
        canvasRef.current.width = width * devicePixelRatio;
        canvasRef.current.height = height * devicePixelRatio;
        canvasRef.current.setAttribute('style', convertSizeToCssString({
            width,
            height
        }));
        ctx.current.scale(devicePixelRatio, devicePixelRatio);
        ctx.current.drawImage(imageRef.current, 0, 0, width, height);
    }

    useEffect(() => {
        const context2d = canvasRef.current?.getContext('2d')
        if (context2d) {
            ctx.current = context2d
        }

    }, [canvasRef]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        setupContainerResize(containerRef.current, setCssSizes)
    }, [containerRef])

    useEffect(() => {
        if (!imageSrc) {
            return;
        }
        if (!imageRef.current) {
            imageRef.current = new Image();
        }
        imageRef.current.addEventListener(
            "load",
            () => {
                if (containerRef.current) {
                    callInitialContainerSize(containerRef.current, setCssSizes)
                }
            },
            false,
        );
        imageRef.current.src = imageSrc;
    }, [imageSrc]);

    return <div className={styles.container} ref={containerRef}>
        <canvas ref={canvasRef}/>
    </div>;
}