const crypto = require('crypto');

const apputils = require('./apputils');
const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');
const time = require('./time');

//TODO redo this
function argParser(args) {
    var timeRe = /^\d{1,2}:?\d{2}(am|a|pm|p)?$/i;
    var dateRe = /^\d{1,2}\/\d{1,2}(\/\d{2})?$/;
    var customerRe = /^[A-z]\w*$/;

    var split = args.split(' ');
    switch(split.length) {
    case 0:
        return { time: null, date: null, customer: null };
    case 1:
        if (timeRe.test(split[0])) {
            return { time: split[0], date: null, customer: null };
        }
        if (dateRe.test(split[0])) {
            return { time: null, date: split[0], customer: null };
        }
        return { time: null, date: null, customer: split[0] };
    default:
        var time = null;
        var date = null;
        var customer = null;
        for (var s of split) {
            if (timeRe.test(s)) {
                time = s;
            } else if (dateRe.test(s)) {
                date = s;
            } else if (customerRe.test(s)) {
                if (customer === null) {
                    customer = s;
                } else {
                    customer += ' ' + s;
                }
            }
        }
        return { time, date, customer };
    }
}

function timeParser(say, timeArg, slackUserId) {
    try {
        return time.timeParameter(timeArg);
    } catch (err) {
        if (err instanceof errors.ValueError) {
            say(`<@${slackUserId}> Unable to parse timestamp: ${timeArg}`);
            return { hour: null, minute: null };
        } else {
            throw err;
        }
    }
}

function dateParser(say, dateArg, slackUserId) {
    try {
        return time.dateParameter(dateArg);
    } catch (err) {
        if (err instanceof errors.ValueError) {
            say(`<@${slackUserId}> Unable to parse datestamp: ${dateArg}`);
            return null;
        } else {
            throw err;
        }
    }
}

module.exports.clockinResponse = async function({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    var now = new Date();
    var start = now;
    var id = crypto.randomBytes(16).toString('hex');
    if (args.time) {
        var { hour, minute } = timeParser(say, args.time, command.user_id);
        if (!hour && hour !== 0) return;
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }
    if (args.date) {
        var parsedDate = dateParser(say, args.date, command.user_id);
        if (parsedDate === null) return;
        start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(),
            start.getHours(), start.getMinutes(), 0, 0);
    }
    if (args.customer) {
        apputils.clockin(say, command.user_id, args.customer, start, false, id);
        return;
    }

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
    if (!employeeId) return;

    if (await db.checkIfEmployeeHasClockinResponses(employeeId)) {
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

    db.createClockinResponse(employeeId, time.sqlDatetime(now), time.sqlDatetime(start), false, id);

    say({ blocks: responseBlocks });
};

module.exports.clockinTravelResponse = async function({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    var now = new Date();
    var start = now;
    var id = crypto.randomBytes(16).toString('hex');
    if (args.time) {
        var { hour, minute } = timeParser(say, args.time, command.user_id);
        if (!hour && hour !== 0) return;
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }
    if (args.date) {
        var parsedDate = dateParser(say, args.date, command.user_id);
        console.log(parsedDate);
        if (parsedDate === null) return;
        start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(),
            start.getHours(), start.getMinutes(), 0, 0);
    }
    if (args.customer) {
        apputils.clockin(say, command.user_id, args.customer, start, true, id);
        return;
    }

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
    if (!employeeId) return;

    if (await db.checkIfEmployeeHasClockinResponses(employeeId)) {
        say(`<@${command.user_id}> You've already gotten a check out message. ` +
            'Please use that one before requesting another.');
        return;
    }

    var customers = await db.getCustomers();

    if (customers.length === 0) {
        say('No customers in database.');
        return;
    }

    var responseBlocks = blocks.clockinBlocks(command.user_id, id, customers);

    db.createClockinResponse(employeeId, time.sqlDatetime(now), time.sqlDatetime(start), true, id);

    say({ blocks: responseBlocks });
};

module.exports.clockoutResponse = async function({ command, ack, say }) {
    ack();

    var args = argParser(command.text);
    var now = new Date();
    var finished = now;
    if (args.time) {
        var { hour, minute } = timeParser(say, args.time, command.user_id);
        if (!hour && hour !== 0) return;
        finished = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }
    if (args.date) {
        var parsedDate = dateParser(say, args.date, command.user_id);
        console.log(parsedDate);
        if (parsedDate === null) return;
        finished = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(),
            finished.getHours(), finished.getMinutes(), 0, 0);
    }
    var employeeId;
    var customer;
    if (args.customer) {
        employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
        if (!employeeId) return;

        customer = await db.searchCustomers(args.customer);
        if (!customer) {
            say(`<@${command.user_id}> Customer ${args.customer} not found.`);
            return;
        }

        try {
            var clocks = await db.getActiveClockFromEmployeeIdAndCustomerId(employeeId, customer.id);
        } catch (err) {
            if (err instanceof errors.EntryNotFoundError) {
                say(`<@${command.user_id}> That session was not found.`);
                return;
            } else {
                throw err;
            }
        }

        if (clocks.length > 1) {
            say(`<@${command.user_id}> You have more than one seesion with ${customer.name}. ` +
                'Please run this command without the customer argument.');
            return;
        }

        if (finished < clocks[0].start) {
            say(`<@${command.user_id}> The time you finished at is before the time you started.`);
            return;
        }

        apputils.clockout(say, command.user_id, finished, clocks[0].id);
        return;
    }

    employeeId = await apputils.getEmployeeIdFromSlackUserId(say, command.user_id);
    if (!employeeId) return;

    var activeClocks = await apputils.getActiveClocksFromEmployeeId(say, command.user_id, employeeId);
    if (!activeClocks) return;

    var options = [];
    for (var clock of activeClocks) {
        customer = await apputils.getCustomerNameFromId(say, command.user_id, clock.customerId);
        var start = time.humanReadableDate(clock.start);
        options.push({
            'text': `${customer} - ${start}`,
            'id': clock.id
        });
    }

    var id = crypto.randomBytes(16).toString('hex');
    db.createClockoutResponse(employeeId, finished, id);

    say({ blocks: blocks.clockoutBlocks(command.user_id, id, options) });
};

module.exports.nicknames = async function({ command, ack, say }) {
    ack();

    var customers = await db.getCustomers();
    if (customers.length < 1) {
        say(`<@${command.user_id}> No customers in database.`);
        return;
    }

    say({ blocks: blocks.nicknameSelectBlocks(command.user_id, customers) });
};

module.exports.register = async function({ command, ack, say }) {
    ack();

    var slackId = command.user_id;
    var slackUsername = command.user_name;
    var id = crypto.randomBytes(16).toString('hex');

    try {
        await db.registerEmployee(slackUsername, slackId, id);
    } catch (err) {
        if (err instanceof errors.EntryAlreadyExistsError) {
            if (err.message.includes('registered')) {
                say(`<@${slackId}> You are already registered`);
                return;
            } else if (err.message.includes('register')) {
                say(`<@${slackId}> You have already tried to register`);
                return;
            } else
                throw err;
        }
    }
    
    say(`<@${slackId}> You have been registered. You will not be able to ` +
        'use the bot until you have been verified.');
};
