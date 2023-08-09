import pickerIcon from "../../assets/color-picker.svg";
import styles from "./styles.module.css";

type Props = {
  isPickerSelected: boolean;
  selectedColor: string | null;
  onTogglePicker: VoidFunction;
};

export const Toolbar = (props: Props) => {
  const { selectedColor, isPickerSelected, onTogglePicker } = props;

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.colorPickerButton} ${
          isPickerSelected ? styles.colorPickerButtonActive : ""
        }`}
        type="button"
        onClick={onTogglePicker}
      >
        <img src={pickerIcon} alt={"Color Picker icon"} />
      </button>
      {isPickerSelected && selectedColor && (
        <div
          className={styles.selectedColor}
          style={{ backgroundColor: selectedColor }}
        >
          {selectedColor}
        </div>
      )}
    </div>
  );
};
