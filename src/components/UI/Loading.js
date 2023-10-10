import classes from './Loading.module.scss';

export default function Loading() {
    return (
        <div className={classes.loading}>
            <div className={classes.wheel}></div>
        </div>
    );
}
