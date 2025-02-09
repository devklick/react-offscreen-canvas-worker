import React, { useCallback, useEffect } from "react";
import { WorkerReceivedMessage, WorkerSentMessage } from "../workers/oscWorker";
import { useOffscreenCanvas } from "./canvasHooks";
import { SetupWorkerCallback, useOffscreenWorker } from "./workerHooks";
import OscWorker from "../workers/oscWorker.ts?worker";

interface UseMyWorkerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function useMyWorker(): UseMyWorkerReturn {
  const [canvasRef, offscreenCanvasRef] = useOffscreenCanvas(sendResizeMessage);

  /**
   * Function to initialize the worker.
   * This can be considered a constructor.
   */
  const sendSetupMessage = useCallback<SetupWorkerCallback>(() => {
    if (!offscreenCanvasRef.current) return;
    const message: WorkerReceivedMessage.Setup = {
      type: "SETUP",
      canvas: offscreenCanvasRef.current,
    };
    const transfer = [offscreenCanvasRef.current];
    return [message, transfer];
  }, [offscreenCanvasRef]);

  /**
   * Function to handle messages sent by the worker.
   */
  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerSentMessage.MessageData>) => {
      if (event.data.type === WorkerSentMessage.Types.fps) {
        // TODO: Update the current FPS in state.
      }
    },
    []
  );

  /**
   * Create the offscreen canvas worker.
   */
  const [workerRef] = useOffscreenWorker(
    OscWorker,
    handleWorkerMessage,
    sendSetupMessage
  );

  /**
   * Function to send a STOP message to the worker.
   * This is used to cancel animations.
   */
  const sendStopMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.stop,
    } satisfies WorkerReceivedMessage.Stop);
  }, [workerRef]);

  /**
   * Function to send an UPDATE message to the worker.
   * This is used to update the animation params whenever the props change.
   */
  const sendUpdateMessage = useCallback(
    (data: Omit<WorkerReceivedMessage.Update, "type">) => {
      workerRef.current.postMessage({
        type: WorkerReceivedMessage.Types.update,
        ...data,
      } satisfies WorkerReceivedMessage.Update);
    },
    [workerRef]
  );

  const sendPausedMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.pause,
    } satisfies WorkerReceivedMessage.Pause);
  }, [workerRef]);

  const sendResumeMessage = useCallback(() => {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.resume,
    } satisfies WorkerReceivedMessage.Resume);
  }, [workerRef]);

  function sendResizeMessage(width: number, height: number) {
    workerRef.current.postMessage({
      type: WorkerReceivedMessage.Types.resize,
      height,
      width,
    } satisfies WorkerReceivedMessage.Resize);
  }

  const handleVisibilityChanged = useCallback(() => {
    if (document.hidden) sendPausedMessage();
    else sendResumeMessage();
  }, [sendPausedMessage, sendResumeMessage]);

  useEffect(() => {
    window.addEventListener("visibilitychange", handleVisibilityChanged);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChanged);
  }, [handleVisibilityChanged]);

  /**
   * Monitor the props for changes and send them to the worker.
   */
  useEffect(() => {
    sendStopMessage();
    sendUpdateMessage({});
  }, [sendUpdateMessage, sendStopMessage]);

  return { canvasRef };
}
