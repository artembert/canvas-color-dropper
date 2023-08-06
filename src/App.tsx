import imageSample from './assets/image-sample.jpg'
import './App.css'
import {Canvas} from "./components/canvas";
import {EditorLayout} from "./components/editor-layout";
import {Toolbox} from "./components/toolbox";

function App() {
    return (
        <EditorLayout canvas={<Canvas imageSrc={imageSample}/>} status={<span>#333333</span>}
                      toolbox={<Toolbox/>}/>
    )
}

export default App
