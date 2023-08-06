import styles from './styles.module.css';
import {ReactNode} from "react";

type Props = {
    toolbox: ReactNode,
    status: ReactNode,
    canvas: ReactNode,
};

export const EditorLayout = (props: Props) => {
    const {canvas, toolbox, status} = props;

    return (
        <div className={styles.editorLayout}>
            <header className={styles.header}>
                <div className={styles.logo}></div>
                <div className={styles.toolbox}>{toolbox}</div>
                <div className={styles.status}>{status}</div>
            </header>
            <div className={styles.canvas}>{canvas}</div>
        </div>
    );
};