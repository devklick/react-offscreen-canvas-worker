import FPS from "./components/FpsCounter";

import "./App.scss";
import Canvas from "./components/Canvas";

function App() {
  return (
    <div className="app">
      <FPS />
      <Canvas width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

export default App;
