import { useEffect, useRef } from "react";
import { WorkerReceivedMessage } from "../workers/oscWorker";

type WorkerConstructor = {
  new (): Worker;
};

type WorkerMessageHandler<T> = (e: MessageEvent<T>) => void;

export type SetupWorkerCallback = () =>
  | [WorkerReceivedMessage.Setup, Transferable[]]
  | undefined;

export function useOffscreenWorker<T>(
  workerCtor: WorkerConstructor,
  handler: WorkerMessageHandler<T>,
  getInitParams: SetupWorkerCallback
) {
  const workerRef = useRef<Worker>(new workerCtor());
  workerRef.current.onmessage = handler;
  const initialized = useRef(false);

  useEffect(() => {
    if (workerRef.current && !initialized.current) {
      const initParams = getInitParams();
      if (initParams) {
        workerRef.current.postMessage(initParams[0], initParams[1]);
      }

      initialized.current = true;
    }
  }, [getInitParams]);

  return [workerRef] as const;
}
