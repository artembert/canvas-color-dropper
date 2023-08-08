import {useEffect, useRef} from "react";
import styles from './styles.module.css';

type Props = {
    sourceCanvas?: HTMLCanvasElement | null,
    image?: HTMLImageElement | null,
    x: number,
    y: number,
};

export const PixelatedZoomArea = (props: Props) => {
    const {sourceCanvas, x, y, image} = props;

    const devicePixelRatio = window.devicePixelRatio;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const context2D = canvasRef.current?.getContext('2d')
        if (context2D) {
            ctx.current = context2D
            ctx.current.imageSmoothingEnabled = false;
        }

    }, [canvasRef]);

    const drawImage = () => {
        if (!sourceCanvas || !image) {
            return;
        }
        ctx.current?.drawImage(
            sourceCanvas,
            Math.min(Math.max(0, x - 5), image.width - 10),
            Math.min(Math.max(0, y - 5), image.height - 10),
            10, 10,
            0, 0,
            200, 200
        );
    }

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        drawImage()
        // canvasRef.current.width = 200 * devicePixelRatio;
        // canvasRef.current.height = 200 * devicePixelRatio;
        // canvasRef.current.setAttribute('style', convertSizeToCssString({
        //     width,
        //     height
        // }));
        // ctx.current?.scale(devicePixelRatio, devicePixelRatio);
    }, [x, y])

    return (
        <div className={styles.pixelatedZoomArea} style={{left: x / devicePixelRatio, top: y / devicePixelRatio}}>
            <canvas width={200} height={200} ref={canvasRef}/>
        </div>
    );
};