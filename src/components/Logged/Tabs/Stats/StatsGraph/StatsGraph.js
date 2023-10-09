import classes from './StatsGraph.module.scss';

export default function StatsGraph({percentageArr}) {
    const graphBars = percentageArr.map((percentage, index) => {
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div key={`percentage-key-${index}`} className={classes['graph-unit']}>
                <div
                    style={{
                        background: `linear-gradient(to top, rgb(180, 51, 51) ${percentage}%, rgb(75, 44, 44) ${percentage}%`,
                    }}
                    className={classes['graph-bar']}
                ></div>
                <p>{weekDays[index]}</p>
            </div>
        );
    });
    return (
        <div className={classes.graph}>
            <p className={classes.title}>Week Days Activity Graph</p>
            {graphBars}
        </div>
    );
}
