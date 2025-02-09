import { useEffect, useRef } from "react";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return [canvasRef] as const;
}

export function useOffscreenCanvas(
  onResize: (width: number, height: number) => void
) {
  const [canvasRef] = useCanvas();
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !offscreenCanvasRef.current) {
      offscreenCanvasRef.current =
        canvasRef.current.transferControlToOffscreen();
    }
  }, [canvasRef, offscreenCanvasRef]);

  useEffect(() => {
    function resize() {
      onResize(window.innerWidth, window.innerHeight);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [onResize]);

  return [canvasRef, offscreenCanvasRef] as const;
}
