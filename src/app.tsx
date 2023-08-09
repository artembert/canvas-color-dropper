import { useCallback, useState } from "react";
import imageSample from "./assets/image-sample.jpg";
import { Canvas } from "./components/canvas";
import { EditorLayout } from "./components/editor-layout";
import { Toolbar } from "./components/toolbar";
import "./app.css";

function App() {
  const [isPickerSelected, setIsPickerSelected] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handlePickerToggle = useCallback(() => {
    setIsPickerSelected((val) => {
      if (val) {
        setSelectedColor(null);
      }
      return !val;
    });
  }, []);

  return (
    <EditorLayout
      canvas={
        <Canvas
          isPickerSelected={isPickerSelected}
          imageSrc={imageSample}
          onChangeSelectedColor={setSelectedColor}
        />
      }
      toolbar={
        <Toolbar
          isPickerSelected={isPickerSelected}
          selectedColor={selectedColor}
          onTogglePicker={handlePickerToggle}
        />
      }
    />
  );
}

export default App;
