import imageSample from './assets/image-sample.jpg'
import './App.css'
import {Canvas} from "./components/canvas";

function App() {
  return (
      <Canvas width={1920} height={1080} imageSrc={imageSample}/>
  )
}

export default App
