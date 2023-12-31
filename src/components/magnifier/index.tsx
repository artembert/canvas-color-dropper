import { useCallback, useEffect, useRef } from "react";
import { MAGNIFICATION_FACTOR, MAGNIFIER_SIZE } from "../../constants.ts";
import styles from "./styles.module.css";

type Props = {
  sourceCanvas?: HTMLCanvasElement | null;
  x: number;
  y: number;
  currentColor: string | null;
};

export const Magnifier = (props: Props) => {
  const { sourceCanvas, x, y, currentColor } = props;

  const devicePixelRatio = window.devicePixelRatio;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const offscreenCanvasRef = useRef<OffscreenCanvas>(
    new OffscreenCanvas(MAGNIFIER_SIZE, MAGNIFIER_SIZE),
  );
  const offscreenCtx = useRef<OffscreenCanvasRenderingContext2D>(
    offscreenCanvasRef.current!.getContext("2d", { alpha: false }),
  );
  offscreenCtx.current!.imageSmoothingEnabled = false;

  useEffect(() => {
    const context2D = canvasRef.current?.getContext("2d", { alpha: false });
    if (context2D) {
      ctx.current = context2D;
      ctx.current.imageSmoothingEnabled = false;
    }
  }, [canvasRef]);

  const drawImage = useCallback(() => {
    if (!sourceCanvas || !offscreenCtx) {
      return;
    }
    offscreenCtx.current?.drawImage(
      sourceCanvas,
      x - MAGNIFIER_SIZE / (2 * MAGNIFICATION_FACTOR),
      y - MAGNIFIER_SIZE / (2 * MAGNIFICATION_FACTOR),
      MAGNIFIER_SIZE / MAGNIFICATION_FACTOR,
      MAGNIFIER_SIZE / MAGNIFICATION_FACTOR,
      0,
      0,
      MAGNIFIER_SIZE,
      MAGNIFIER_SIZE,
    );
    ctx.current?.drawImage(offscreenCanvasRef.current, 0, 0);
  }, [offscreenCtx, sourceCanvas, x, y]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    drawImage();
  }, [drawImage, x, y]);

  return (
    <div
      className={styles.pixelatedZoomArea}
      style={{ left: x / devicePixelRatio, top: y / devicePixelRatio }}
    >
      <canvas width={MAGNIFIER_SIZE} height={MAGNIFIER_SIZE} ref={canvasRef} />
      <div className={styles.target}></div>
      <span className={styles.colorHex}>{currentColor}</span>
    </div>
  );
};
