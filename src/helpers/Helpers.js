export function getTimeStampNow() {
    return new Date().getTime();
}

export function logTimeFromMsStamp(timeStamp) {
    if (!timeStamp) return console.log(new Date().getTime());
    console.log(new Date(timeStamp));
}

export function millisecondsToDecimal(miliseconds, msToUnit) {
    /* 
        Convert milliseconds TimeStamps to decimals Units of time.
            ex:.. 
            
                35.5 min  => 35 min and 30 sec         
                1.2 h => 1 hour and 15 min
        
        If msToUnit is empty will convert to minutes 
    */

    if (msToUnit === 'sec') return +(miliseconds / 1000).toFixed(0);
    if (msToUnit === 'h') return +(miliseconds / 60000 / 60).toFixed(0);

    return +(miliseconds / 60000).toFixed(0);
}

export function getTimeBetweenTimeStamps(start, end, unit) {
    /* 
        By default (if not specified) the time unit will be minutes
    */

    if (!unit) unit = 'min';

    const timeFrameStamp = end - start;
    return millisecondsToDecimal(timeFrameStamp, unit);
}

// console.log(getTimeStampNow());
// console.log(new Date('19 Sep 2023 12:00:00').getTime());