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
            <button type='button' onClick={onTogglePicker}>[Picker]</button>
            {isPickerSelected &&
                <div className={styles.currentColor}>{currentColor}</div>}
        </div>
    );
};