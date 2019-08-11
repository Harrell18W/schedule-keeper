const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');
const time = require('./time');

module.exports.clockin = async function(say, slackUserId, customerName, start, id) {
    var employeeId = await this.getEmployeeIdFromSlackUserId(say, slackUserId);
    if (!employeeId) return;

    if (await db.checkIfEmployeeHasClockinResponses(employeeId)) {
        say(`<@${slackUserId}> You've already gotten a check out message. ` +
            'Please use that one before requesting another.');
        return;
    }

    var customer = await db.searchCustomers(customerName);
    if (!customer) {
        say(`<@${slackUserId}> Customer ${customerName} not found`);
        return;
    }

    db.createActiveClock(employeeId, customer.id, time.sqlDatetime(start), id);

    var hrDate = start.toString().substring(0, 24);
    say({ blocks: blocks.clockinReponseBlocks(customerName, hrDate, id) });
};

module.exports.clockout = async function(say, slackUserId, end, id) {
    var activeClock = await this.getActiveClock(say, slackUserId, id);
    if (!activeClock) return;

    var employeeId = await this.getEmployeeIdFromSlackUserId(say, slackUserId);
    if (!employeeId) return;

    var customerName = await this.getCustomerNameFromId(say, slackUserId, activeClock.customerId);
    if (!customerName) return;

    db.createFinishedClock(employeeId, activeClock.customerId, time.sqlDatetime(activeClock.start), time.sqlDatetime(end), id);
    db.deleteActiveClock(id);

    var timeDifference = time.dateDifference(activeClock.start, end);
    say({ blocks: blocks.clockoutResponseBlocks(customerName, time.humanReadableDate(activeClock.start), time.humanReadableDate(end), timeDifference, id)});
};

module.exports.getClockinResponse = async function(say, slackUserId, responseId) {
    try {
        return await db.getClockinResponse(responseId);
    } catch(err) {
        if(err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> ` +
                'The message that you tried to respond to was not found. ' +
                'Did you already respond to it?');
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getClockoutResponse = async function(say, slackUserId, responseId) {
    try {
        return await db.getClockoutResponse(responseId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> That response was not found. Did you already respond to it?`);
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getEmployeeIdFromSlackUserId = async function (say, slackUserId) {
    try {
        return await db.getEmployeeIdFromSlackUserId(slackUserId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> You do not appear to be in the employee database.`);
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getCustomerNameFromId = async function(say, slackUserId, id) {
    try {
        return (await db.getCustomerFromId(id)).name;
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> That customer was not found.`);
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getActiveClock = async function(say, slackUserId, id) {
    try {
        return await db.getActiveClock(id);
    } catch(err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> That session was not found.`);
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getActiveClocksFromEmployeeId = async function(say, slackUserId, employeeId) {
    try {
        return await db.getActiveClocksFromEmployeeId(employeeId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> There is no active session tied to your name. ` +
                'Did you already clock out or cancel your session?');
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getFinishedClock = async function(say, slackUserId, finishedClockId) {
    try {
        return await db.getFinishedClock(finishedClockId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> The session associated with that message was not found. ` +
                'It may have already been handled or deleted.');
        }
    }
};
