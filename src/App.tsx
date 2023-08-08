import imageSample from './assets/image-sample.jpg'
import './App.css'
import {Canvas} from "./components/canvas";
import {EditorLayout} from "./components/editor-layout";
import {Toolbar} from "./components/toolbar";
import {useCallback, useState} from "react";

function App() {
    const [isPickerSelected, setIsPickerSelected] = useState(true)
    const [currentColor, setCurrentColor] = useState<string>('')

    const handlePickerToggle = useCallback(() => {
        setIsPickerSelected(val => !val)
    }, [])

    return (
        <EditorLayout
            canvas={<Canvas isPickerSelected={isPickerSelected} currentColor={currentColor} imageSrc={imageSample}
                            onChangeCurrentColor={setCurrentColor}/>}
            toolbar={<Toolbar isPickerSelected={isPickerSelected} currentColor={currentColor}
                              onTogglePicker={handlePickerToggle}/>}/>
    )
}

export default App
