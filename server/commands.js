const crypto = require('crypto');

const apputils = require('./apputils');
const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');
const time = require('./time');

function argParser(args) {
    var stripped = args.split(' ');
    var parsed = [];
    for (var i of stripped)
        if (i !== '') parsed.push(i);
    if (parsed.length === 0)
        return { time: null, customer: null };
    if (parsed.length > 2)
        throw new errors.CommandArgsError(`Invalid args ${args}`);
    if (/\d+[amp]{0,2}$/.test(args[0])) {
        return {
            time: parsed[0],
            customer: parsed.length > 1 ? parsed[1] : null
        };
    }
    return {
        time: null,
        customer: parsed[0]
    };
}

function timeParser(say, timeArg, slackUserId) {
    try {
        return time.timeParameter(timeArg);
    } catch (err) {
        if (err instanceof errors.ValueError) {
            say(`<@${slackUserId}> Unable to parse timestamp`);
            return { hour: null, minute: null };
        } else {
            throw err;
        }
    }
}

module.exports.clockinResponse = async function ({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    var now = new Date();
    var start = now;
    var id = crypto.randomBytes(16).toString('hex');
    if (args.time) {
        var { hour, minute } = timeParser(say, args.time, command.user_id);
        if (!hour) return;
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }
    if (args.customer) {
        console.log('id: ' + command.user_id);
        apputils.clockin(say, command.user_id, args.customer, start, id);
        return;
    }

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
    if (!employeeId) return;

    if (await db.checkIfEmployeeHasActiveClocks(employeeId)) {
        say(`<@${command.user_id}> You're already clocked in with a customer`);
        return;
    }

    if (await db.checkIfEmployeeHasSlackResponses(employeeId)) {
        say(`<@${command.user_id}> You've already gotten a check out message. ` +
            'Please use that one before requesting another.');
        return;
    }

    var customers = await db.getCustomers();

    if (customers.length === 0) {
        say('No customers in database');
        return;
    }


    var responseBlocks = blocks.clockinBlocks(command.user_id, id, customers);

    db.createResponse(employeeId, time.sqlDatetime(now), time.sqlDatetime(start), id);

    say({ blocks: responseBlocks });
};

module.exports.clockoutResponse = async function({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    var now = new Date();
    var finished = now;
    if (args.time) {
        var { hour, minute } = timeParser(say, args.time, command.user_id);
        if (!hour) return;
        finished = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
    if (!employeeId) return;

    var activeClock = await apputils.getActiveClockFromEmployeeId(say, command.user_id, employeeId);

    if (activeClock.start > finished) {
        say(`<@${command.user_id}> The clockout time you've specified is before the time at which you started`);
        return;
    }

    var customerName = (await db.getCustomerFromId(activeClock.customerId)).name;

    db.createFinishedClock(employeeId, activeClock.customerId, time.sqlDatetime(activeClock.start), time.sqlDatetime(finished), activeClock.id);
    db.deleteActiveClock(activeClock.id);

    var hrStart = time.humanReadableDate(activeClock.start);
    var hrFinished = time.humanReadableDate(finished);
    var timeDifference = time.dateDifference(activeClock.start, finished);

    say({ blocks: blocks.clockoutBlocks(customerName, hrStart, hrFinished, timeDifference, activeClock.id) });
};