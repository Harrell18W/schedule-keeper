const blocks = require(`./blocks`);
const errors = require('./errors');
const db = require('./database');
const time = require('./time');

module.exports.clockinRequestResponse = async function({ ack, say, action, body }) {
    ack();

    var responseId = action.action_id.substring(16);

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
    var customerId = await db.getCustomerIdFromName(customerName);

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    //TESTLATER
    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    db.createActiveClock(employeeId, customerId, time.sqlDatetime(response.start), responseId);
    await db.deleteResponse(responseId);

    //TODO make this nicer
    var hrDate = response.start.toString().substring(0, 24);

    say({ blocks: blocks.clockinReponseBlocks(customerName, hrDate, responseId) });
}

module.exports.clockinRequestCancel = async function({ ack, say, action, body }) {
    ack();

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    var responseId = action.action_id.substring(23);

    try {
        var response = await db.getResponse(responseId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> ` +
                `The message that you just tried to cancel was not found. ` +
                `Did you already cancel it?`);
            return;
        } else {
            throw err;
        }
    }

    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    db.deleteResponse(response.id);

    say(`<@${body.user.id}> Your clockin request was cancelled`);

}

module.exports.clockoutButton = async function({ ack, say, action, body }) {
    ack();

    var id = action.action_id.substring(16);

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    try {
        var activeClock = await db.getActiveClockFromEmployeeId(employeeId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> There is no active session tied to your name. ` +
                `Did you already clock out or cancel your session?`);
            return;
        } else {
            throw err;
        }
    }

    var customerName = (await db.getCustomerFromId(activeClock.customerId)).name;

    var finished = new Date();

    db.createFinishedClock(employeeId, activeClock.customerId, time.sqlDatetime(activeClock.start), time.sqlDatetime(finished), activeClock.id);
    db.deleteActiveClock(activeClock.id);

    var timeDifference = time.dateDifference(activeClock.start, finished);

    say({ blocks: blocks.clockoutBlocks(customerName, time.humanReadableDate(activeClock.start), time.humanReadableDate(finished), timeDifference, activeClock.id) });

}

module.exports.clockoutCancel = async function({ ack, say, action, body }) {
    ack();

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    var activeClockId = action.action_id.substring(16);

    try {
        var activeClock = await db.getActiveClockFromEmployeeId(employeeId);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> There are no sessions associated with you. ` +
                `Did you already clock in or cancel your session?`);
            return;
        }
    }

    var customerName = (await db.getCustomerFromId(activeClock.customerId)).name;

    db.deleteActiveClock(activeClock.id);

    say(`<@${body.user.id}> Your session with ${customerName} was cancelled`);

}

module.exports.sessionCancel = async function({ ack, say, action, body }) {
    ack();

    try {
        var employeeId = await db.getEmployeeIdFromSlackUserId(body.user.id);
    } catch (err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> You do not appear to be in the employee database`);
            return;
        } else {
            throw err;
        }
    }

    var finishedClockId = action.action_id.substring(15);

    try {
        var finishedClock = await db.getFinishedClock(finishedClockId);
    } catch(err) {
        if (err instanceof errors.EntryNotFoundError) {
            say(`<@${body.user.id}> The session associated with that message was not found. ` +
                `It may have already been handled.`);
            return;
        } else {
            throw err;
        }
    }

    var customerName = (await db.getCustomerFromId(finishedClock.customerId)).name;

    db.deleteFinishedClock(finishedClockId);

    say(`<@${body.user.id}> Your finished session with ${customerName} was deleted`);

}