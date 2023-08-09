import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  toolbar: ReactNode;
  canvas: ReactNode;
};

export const EditorLayout = (props: Props) => {
  const { canvas, toolbar } = props;

  return (
    <div className={styles.editorLayout}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Canvas Color Dropper</h1>
      </header>
      <main className={styles.content}>
        <div className={styles.toolbar}>{toolbar}</div>
        <div className={styles.canvas}>{canvas}</div>
      </main>
    </div>
  );
};
