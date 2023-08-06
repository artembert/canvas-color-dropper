import styles from './styles.module.css';

type Props = {};

export const Toolbox = (props: Props) => {
    const {} = props;

    return (
        <div className={styles.toolbox}>
            <button type='button'>[Picker]</button>
        </div>
    );
};