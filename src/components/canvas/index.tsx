import {MouseEvent, useEffect, useRef, useState} from 'react';
import {setupContainerResize} from "../../utils/setupContainerResize.ts";
import {ISize} from "../../types.ts";
import {convertSizeToCssString} from "../../utils/convert-size-to-css-string.ts";
import styles from './styles.module.css';
import {callInitialContainerSize} from "../../utils/getInitialContainerSize.ts";
import {PixelatedZoomArea} from "../pixelated-zoom-area";
import {MAGNIFIER_SIZE} from "../../constants.ts";
import {resolveHexColor} from "../../utils/canvas/resolve-hex-color.ts";

type Props = {
    isPickerSelected: boolean;
    currentColor: string;
    onChangeCurrentColor: (color: string) => void;
    imageSrc?: string;
}

const root = document.documentElement;

export const Canvas = ({isPickerSelected, imageSrc, currentColor, onChangeCurrentColor}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const devicePixelRatio = window.devicePixelRatio;

    const [coords, setCoords] = useState<[number, number]>([0, 0])
    const [isCursorOnCanvas, setIsCursorOnCanvas] = useState(false)

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
        root.style.setProperty('--magnifier-size', `${MAGNIFIER_SIZE}px`)
    }, [])

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

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!(isPickerSelected || isCursorOnCanvas)) {
            return;
        }
        const coords = canvasRef.current?.getBoundingClientRect();
        const x = (e.clientX - (coords?.x || 0)) * devicePixelRatio;
        const y = (e.clientY - (coords?.y || 0)) * devicePixelRatio;
        const pixel = ctx.current?.getImageData(x, y, 1, 1).data;
        if (pixel) {
            const hex = resolveHexColor(pixel)
            onChangeCurrentColor(hex);
            root.style.setProperty('--picked-color', hex)
        }
        setCoords([x, y])
    };

    const handleMouseEnter = () => {
        if (isPickerSelected) {
            setIsCursorOnCanvas(true)
        }
    }

    const handleMouseLeave = () => {
        setIsCursorOnCanvas(false)
    }

    return <div className={styles.container} ref={containerRef}>
        <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}/>
        {isCursorOnCanvas &&
            <PixelatedZoomArea image={imageRef.current} currentColor={currentColor} sourceCanvas={canvasRef.current}
                               x={coords[0]}
                               y={coords[1]}/>}
    </div>;
}