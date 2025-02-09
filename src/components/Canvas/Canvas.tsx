import useMyWorker from "../../hooks/useMyWorker";

interface CanvasProps {
  width: number;
  height: number;
}
function Canvas({ width, height }: CanvasProps) {
  const { canvasRef } = useMyWorker();

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default Canvas;
