import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { setupContainerResize } from "../../utils/setup-container-resize.ts";
import { ISize } from "../../types.ts";
import { convertSizeToCssString } from "../../utils/convert-size-to-css-string.ts";
import { callInitialContainerSize } from "../../utils/call-initial-container-size.ts";
import { Magnifier } from "../magnifier";
import { MAGNIFIER_SIZE } from "../../constants.ts";
import { resolveHexColor } from "../../utils/resolve-hex-color.ts";
import styles from "./styles.module.css";

type Props = {
  isPickerSelected: boolean;
  onChangeSelectedColor: (color: string | null) => void;
  imageSrc?: string;
};

type PixelMeta = {
  x: number;
  y: number;
  hex: string | null;
};

const root = document.documentElement;

let lastMouseEvent: MouseEvent<HTMLCanvasElement> | null = null;
let drawingScheduled = false;

export const Canvas = ({
  isPickerSelected,
  imageSrc,
  onChangeSelectedColor,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const devicePixelRatio = window.devicePixelRatio;

  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [isCursorOnCanvas, setIsCursorOnCanvas] = useState(false);

  const setCssSizes = useCallback(
    (size: ISize) => {
      if (!canvasRef.current || !ctx.current || !imageRef.current) {
        return;
      }
      const aspectRatio = imageRef.current.width / imageRef.current.height;
      const { width, height } = {
        width: size.width,
        height: size.width / aspectRatio,
      };
      canvasRef.current.width = width * devicePixelRatio;
      canvasRef.current.height = height * devicePixelRatio;
      canvasRef.current.setAttribute(
        "style",
        convertSizeToCssString({
          width,
          height,
        }),
      );
      ctx.current.scale(devicePixelRatio, devicePixelRatio);
      ctx.current.drawImage(imageRef.current, 0, 0, width, height);
    },
    [devicePixelRatio],
  );

  useEffect(() => {
    root.style.setProperty("--magnifier-size", `${MAGNIFIER_SIZE}px`);
  }, []);

  useEffect(() => {
    const context2d = canvasRef.current?.getContext("2d", { alpha: false });
    if (context2d) {
      ctx.current = context2d;
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    setupContainerResize(containerRef.current, setCssSizes);
  }, [containerRef, setCssSizes]);

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
          callInitialContainerSize(containerRef.current, setCssSizes);
        }
      },
      false,
    );
    imageRef.current.src = imageSrc;
  }, [imageSrc, setCssSizes]);

  const getSelectedPixel = useCallback(
    (e: MouseEvent<HTMLCanvasElement>): PixelMeta | null => {
      if (!(isPickerSelected || isCursorOnCanvas)) {
        return null;
      }
      const coords = canvasRef.current?.getBoundingClientRect();
      const x = (e.clientX - (coords?.x || 0)) * devicePixelRatio;
      const y = (e.clientY - (coords?.y || 0)) * devicePixelRatio;
      const pixel = ctx.current?.getImageData(x, y, 1, 1).data;
      const hex = pixel ? resolveHexColor(pixel) : null;
      return {
        x,
        y,
        hex,
      };
    },
    [devicePixelRatio, isCursorOnCanvas, isPickerSelected],
  );

  const updateMagnifier = useCallback(() => {
    if (lastMouseEvent) {
      const pixelData = getSelectedPixel(lastMouseEvent);
      if (!pixelData) {
        return;
      }
      const { x, y, hex } = pixelData;
      setCoords([x, y]);
      setCurrentColor(hex);
      root.style.setProperty("--picked-color", hex);

      lastMouseEvent = null;
    }

    drawingScheduled = false;
  }, [getSelectedPixel]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      lastMouseEvent = e; // Store the latest event
      if (!drawingScheduled) {
        drawingScheduled = true;
        requestAnimationFrame(updateMagnifier);
      }

      const pixelData = getSelectedPixel(e);
      if (!pixelData) {
        return;
      }
      const { x, y, hex } = pixelData;
      setCoords([x, y]);
      setCurrentColor(hex);
      root.style.setProperty("--picked-color", hex);
    },
    [getSelectedPixel, updateMagnifier],
  );

  const handleMouseClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const pixelData = getSelectedPixel(e);
      if (!pixelData) {
        return;
      }
      const { hex } = pixelData;
      onChangeSelectedColor(hex);
    },
    [getSelectedPixel, onChangeSelectedColor],
  );

  const handleMouseEnter = useCallback(() => {
    if (isPickerSelected) {
      setIsCursorOnCanvas(true);
    }
  }, [isPickerSelected]);

  const handleMouseLeave = useCallback(() => {
    setIsCursorOnCanvas(false);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {isCursorOnCanvas && (
        <Magnifier
          image={imageRef.current}
          currentColor={currentColor}
          sourceCanvas={canvasRef.current}
          x={coords[0]}
          y={coords[1]}
        />
      )}
    </div>
  );
};
