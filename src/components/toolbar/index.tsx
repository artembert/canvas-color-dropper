import pickerIcon from '../../assets/color-picker.svg'
import styles from './styles.module.css';

type Props = {
    isPickerSelected: boolean;
    currentColor?: string;
    onTogglePicker: VoidFunction;
};

export const Toolbar = (props: Props) => {
    const {currentColor, isPickerSelected, onTogglePicker} = props;

    return (
        <div className={styles.toolbar}>
            <button className={`${styles.colorPickerButton} ${isPickerSelected ? styles.colorPickerButtonActive : ''}`}
                    type='button' onClick={onTogglePicker}>
                <img src={pickerIcon} alt={'Color Picker icon'}/>
            </button>
            {isPickerSelected &&
                <div className={styles.currentColor}>{currentColor}</div>}
        </div>
    );
};