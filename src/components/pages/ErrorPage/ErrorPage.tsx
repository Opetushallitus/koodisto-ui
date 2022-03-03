import * as React from 'react';
import sad from './sad.png';
import styles from './ErrorPage.module.css';

type Props = {
    children?: React.ReactNode;
};

export default function ErrorPage(props: Props) {
    return (
        <div className={styles.VirheKirjautunut}>
            <div className={styles.VirheKirjautunutTausta}>
                <div>
                    <img src={sad} alt={''} />
                </div>
                {props.children}
            </div>
        </div>
    );
}
