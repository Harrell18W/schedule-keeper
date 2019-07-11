//TODO use UTC for dates
const crypto = require('crypto');

const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');

function dateDifference(date1, date2) {
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

//TODO check to make sure given date
function sqlDatetime(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ` +
           `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

//TOOD check employee has no SlackResponses associated
//TODO add cancel button
module.exports.clockinResponse = async function ({ command, ack, say }) {
    ack();

    //TODO fix time options
    //TODO check if employee is already clocked out
    var time = command.text;
    var hour;
    var minute;
    if (time.length == 4) {
        hour = Number(time.substring(0, 2));
        minute = Number(time.substring(2));
    } else if (time.length == 3) {
        hour = Number(time.substring(0, 1));
        minute = Number(time.substring(1));
    } else {
        say('Invalid time');
        return;
    }

    try {
        var employeeId = await db.getEmployeeId(command.user_id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${command.user_id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    var customers = await db.getCustomerNames();

    if (customers.length === 0) {
        say('No customers in database');
        return;
    }

    var id = crypto.randomBytes(16).toString('hex');
    var requestId = 'request_' + id;

    var responseBlocks = blocks.clockinBlocks(command.user_id, requestId, customers);

    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

    db.createResponse(employeeId, sqlDatetime(now), sqlDatetime(start), id);

    say({ blocks: responseBlocks });
}

//TODO add cancel and clockout button
module.exports.clockinRequestResponse = async function({ ack, say, action, body }) {
    ack();

    var responseId = action.action_id.substring(8);

    try {
        var response = await db.getResponse(responseId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> ` +
                `The message that you just tried to respond to was not found. ` +
                `Did you already respond to it?`);
            return;
        } else {
            throw err;
        }
    }

    var customerName = action.selected_option.text.text;
    //TODO maybe add a check here, not really necessary
    var customerId = await db.getCustomerIdFromName(customerName);

    try {
        var employeeId = await db.getEmployeeId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    //TESTLATER
    if (employeeId != response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    db.createActiveClock(employeeId, customerId, sqlDatetime(response.start), responseId);
    db.deleteResponse(responseId);

    var hrDate = response.start.toString().substring(0, 24);

    say({ blocks: blocks.clockinReponseBlocks(customerName, hrDate)});
}

module.exports.clockoutResponse = async function({ command, ack, say }) {
    ack();

    var time = command.text;
    var hour;
    var minute;
    if (time.length == 4) {
        hour = Number(time.substring(0, 2));
        minute = Number(time.substring(2));
    } else if (time.length == 3) {
        hour = Number(time.substring(0, 1));
        minute = Number(time.substring(1));
    } else {
        say('Invalid time');
        return;
    }

    try {
        var employeeId = await db.getEmployeeId(command.user_id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${command.user_id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    try {
        var activeClock = await db.getActiveClockFromEmployeeId(employeeId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${command.user_id}> There is no active session tied to your name`);
            return;
        } else {
            throw err;
        }
    }

    var customerName = (await db.getCustomerFromId(activeClock.customerId)).name;

    //TODO make sure end time is after start time
    var now = new Date();
    var finished = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

    db.createFinishedClock(employeeId, activeClock.customerId, sqlDatetime(activeClock.start), sqlDatetime(finished), activeClock.id);
    db.deleteActiveClock(activeClock.id);

    var timeDifference = dateDifference(activeClock.start, finished);

    say({ blocks: blocks.clockoutBlocks(customerName, timeDifference) });
}