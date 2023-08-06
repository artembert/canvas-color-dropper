import {useEffect, useRef} from 'react';
import {setupContainerResize} from "../../utils/hooks/setupContainerResize.ts";
import {ISize} from "../../types.ts";
import {convertSizeToCssString} from "../../utils/convert-size-to-css-string.ts";
import styles from './styles.module.css';

type Props = {
    width: number,
    height: number,
    imageSrc?: string;
}

export const Canvas = ({height, width, imageSrc}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    const setCssSizes = (size: ISize) => {
        if (!canvasRef.current) {
            return;
        }
        canvasRef.current.setAttribute('style', convertSizeToCssString(size));
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
        const img = new Image();
        img.addEventListener(
            "load",
            () => {
                ctx.current?.drawImage(img, 0, 0);
            },
            false,
        );
        img.src = imageSrc;
    }, [imageSrc]);

    return <div className={styles.container} ref={containerRef}>
        <canvas ref={canvasRef} width={width} height={height}/>
    </div>;
}