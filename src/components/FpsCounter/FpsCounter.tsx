import { useEffect, useRef, useState } from "react";
import "./FpsCounter.scss";

function FpsCounter() {
  const [fps] = useState(60);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = `FPS: ${Math.floor(fps)}`;
    }
  }, [fps]);
  return <span ref={ref} className={"fps-counter"} />;
}

export default FpsCounter;
