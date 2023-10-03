import classes from './StatsBox.module.scss';

export default function StatsBox(props) {
    // TODO Graph Stats Box
    let {title, value, unit} = props;

    let statLayoutClass;
    switch (props.type) {
        case 'box':
            statLayoutClass = classes.box;
            break;
        case 'rectangle':
            statLayoutClass = classes.rectangle;
            unit = '';
            break;
        case 'graph':
            statLayoutClass = classes.graph;
            break;
        default:
            break;
    }

    return (
        <div className={statLayoutClass}>
            <p>{title}</p>
            <h1>{value}</h1>
            <p>{unit}</p>
        </div>
    );
}
