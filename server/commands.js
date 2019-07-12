const crypto = require('crypto');

const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');
const time = require('./time');

function argParser(args) {
    var stripped = args.split(' ');
    var parsed = [];
    for (var i of stripped)
        if (i !== '') parsed.push(i);
    return parsed;
}

//TOOD check employee has no SlackResponses associated
//TODO add cancel button
module.exports.clockinResponse = async function ({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    if (args.length !== 0) {
        try {
            var { hour, minute } = time.timeParameter(args[0]);
        } catch (err) {
            if (err instanceof errors.ValueError) {
                say(`<@${command.user_id}> Unable to parse timestamp`);
                return;
            } else {
                throw err;
            }
        }

        var now = new Date();
        var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    } else {
        var now = new Date();
        var start = now;
    }

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(command.user_id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${command.user_id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    if (await db.checkIfEmployeeHasActiveClocks(employeeId)) {
        say(`<@${command.user_id}> You're already checked out with a customer`);
        return;
    }

    if (await db.checkIfEmployeeHasSlackResponses(employeeId)) {
        say(`<@${command.user_id}> You've already gotten a check out message. ` +
            `Please use that one before requesting another.`);
        return;
    }

    var customers = await db.getCustomers();

    if (customers.length === 0) {
        say('No customers in database');
        return;
    }

    var id = crypto.randomBytes(16).toString('hex');
    var requestId = 'request_' + id;

    var responseBlocks = blocks.clockinBlocks(command.user_id, requestId, customers);

    db.createResponse(employeeId, time.sqlDatetime(now), time.sqlDatetime(start), id);

    say({ blocks: responseBlocks });
}

module.exports.clockoutResponse = async function({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    if (args.length !== 0) {
        try {
            var { hour, minute } = time.timeParameter(args[0]);
        } catch (err) {
            if (err instanceof errors.ValueError) {
                say(`<@${command.user_id}> Unable to parse timestamp`);
                return;
            } else {
                throw err;
            }
        }

        var now = new Date();
        var finished = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    } else {
        var now = new Date();
        var finished = now;
    }

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(command.user_id);
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

    if (activeClock.start > finished) {
        say(`<@${command.user_id}> The clockout time you've specified is before the time at which you started`);
        return;
    }

    var customerName = (await db.getCustomerFromId(activeClock.customerId)).name;

    db.createFinishedClock(employeeId, activeClock.customerId, time.sqlDatetime(activeClock.start), time.sqlDatetime(finished), activeClock.id);
    db.deleteActiveClock(activeClock.id);

    var timeDifference = time.dateDifference(activeClock.start, finished);

    say({ blocks: blocks.clockoutBlocks(customerName, timeDifference) });
}