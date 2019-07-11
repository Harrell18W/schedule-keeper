const errors = require('./errors');

module.exports.dateDifference = function(date1, date2) {
    if (date1 > date2) {
        var millis = date1 - date2;
    } else {
        var millis = date2 - date1;
    }

    var hours = Math.floor(millis / 3600000);
    millis = millis - hours * 3600000;
    var minutes = Math.floor(millis / 60000);

    if (hours == 0) {
        return `${minutes} minutes`;
    } else {
        return `${hours} hours, ${minutes} minutes`;
    }
}

module.exports.sqlDatetime = function(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ` +
           `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

module.exports.timeParameter = function(timeArg) {
    if (/^\d{3}([ap]m?)?$/i.test(timeArg)) {
        var digits = timeArg.substring(0, 3);
        var hour = Number(digits.substring(0, 1));
        hour += timeArg.includes('p') ? 12 : 0;
        var minute = Number(digits.substring(1));
    } else if (/^\d{4}([ap]m?)?$/i.test(timeArg)) {
        var digits = timeArg.substring(0, 4);
        var hour = Number(digits.substring(0, 2));
        hour += timeArg.includes('p') ? 12 : 0;
        hour = hour == 24 && timeArg.includes('p') ? 13 : hour;
        var minute = Number(digits.substring(2));
    } else if (/^\d:\d{2}([ap]m?)?$/i.test(timeArg)) {
        var digits = timeArg.substring(0, 4);
        var hour = Number(digits.substring(0, 1));
        hour += timeArg.includes('p') ? 12 : 0;
        var minute = Number(digits.substring(2));
    } else if (/^\d{2}:\d{2}([ap]m?)?$/i.test(timeArg)) {
        var digits = timeArg.substring(0, 5);
        var hour = Number(digits.substring(0, 2));
        hour += timeArg.includes('p') ? 12 : 0;
        hour = hour == 24 && timeArg.includes('p') ? 13 : hour;
        var minute = Number(digits.substring(3));
    } else {
        throw new errors.ValueError(`Invalid time ${timeArg}`);
    }

    if (hour > 23 || minute > 59) {
        throw new errors.ValueError(`Invalid time ${timeArg}`);
    }

    return {
        hour: hour,
        minute: minute
    };

}