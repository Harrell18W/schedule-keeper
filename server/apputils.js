const blocks = require('./blocks');
const db = require('./database');
const errors = require('./errors');
const time = require('./time');

module.exports.clockin = async function(say, slackUserId, customerName, start, id) {
    var employeeId = await this.getEmployeeIdFromSlackUserId(say, slackUserId);
    if (!employeeId) return;

    if (await db.checkIfEmployeeHasActiveClocks(employeeId)) {
        say(`<@${slackUserId}> You're already checked out with a customer`);
        return;
    }
    if (await db.checkIfEmployeeHasSlackResponses(employeeId)) {
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

module.exports.getResponse = async function(say, slackUserId, responseId) {
    try {
        return await db.getResponse(responseId);
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

module.exports.getEmployeeIdFromSlackUserId = async function (say, slackUserId) {
    try {
        return await db.getEmployeeIdFromSlackUserId(slackUserId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${slackUserId}> You do not appear to be in the employee database`);
            return null;
        } else {
            throw err;
        }
    }
};

module.exports.getActiveClockFromEmployeeId = async function(say, slackUserId, employeeId) {
    try {
        return await db.getActiveClockFromEmployeeId(employeeId);
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