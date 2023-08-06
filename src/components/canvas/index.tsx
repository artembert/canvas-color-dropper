import {useEffect, useRef} from 'react';

type Props = {
    width: number,
    height: number,
    imageSrc?: string;
}

export const Canvas = ({height, width, imageSrc}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const context2d = canvasRef.current?.getContext('2d')
        if (context2d) {
            ctx.current = context2d
        }

    }, [canvasRef])

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

    return <canvas ref={canvasRef} width={width} height={height}/>;
}