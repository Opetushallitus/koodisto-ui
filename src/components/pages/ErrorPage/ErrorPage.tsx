import * as React from 'react';
import styles from './ErrorPage.module.css';

type Props = {
    children?: React.ReactNode;
};

export default function ErrorPage(props: Props) {
    return (
        <div className={styles.VirheKirjautunut}>
            <div className={styles.VirheKirjautunutTausta}>{props.children}</div>
        </div>
    );
}
