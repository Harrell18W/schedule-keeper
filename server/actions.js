const apputils = require('./apputils');
const blocks = require('./blocks');
const db = require('./database');
const time = require('./time');

module.exports.clockinRequestResponse = async function({ ack, say, action, body }) {
    ack();

    var responseId = action.action_id.substring(16);
    var response = await apputils.getResponse(say, body.user.id, responseId);
    if (!response) return;

    var customerName = action.selected_option.text.text;

    //TESTLATER
    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;
    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    apputils.clockin(say, body.user.id, customerName, response.start, responseId);
    await db.deleteResponse(responseId);
};

module.exports.clockinRequestCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;

    var responseId = action.action_id.substring(23);
    var response = await apputils.getResponse(say, body.user.id, responseId);
    if (!response) return;

    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    db.deleteResponse(response.id);

    say(`<@${body.user.id}> Your clock in request was cancelled`);
};

module.exports.clockoutButton = async function({ ack, say, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;

    var activeClock = await apputils.getActiveClockFromEmployeeId(say, body.user.id, employeeId);
    if (!activeClock) return;

    var customerName = await apputils.getCustomerNameFromId(say, body.user.id, activeClock.customerId);
    if (!customerName) return;

    var finished = new Date();

    db.createFinishedClock(employeeId, activeClock.customerId, time.sqlDatetime(activeClock.start), time.sqlDatetime(finished), activeClock.id);
    db.deleteActiveClock(activeClock.id);

    var timeDifference = time.dateDifference(activeClock.start, finished);

    say({ blocks: blocks.clockoutBlocks(customerName, time.humanReadableDate(activeClock.start), time.humanReadableDate(finished), timeDifference, activeClock.id) });
};

module.exports.clockoutCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id, action.a);
    if (!employeeId) return;

    var activeClock = await apputils.getActiveClockFromEmployeeId(say, body.user.id, employeeId);
    if (!activeClock) return;

    var customerName = await apputils.getCustomerNameFromId(say, body.user.id, activeClock.customerId);
    if (!customerName) return;

    db.deleteActiveClock(activeClock.id);

    say(`<@${body.user.id}> Your session with ${customerName} was cancelled`);
};

module.exports.sessionCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;

    var finishedClockId = action.action_id.substring(15);

    var finishedClock = await apputils.getFinishedClock(say, body.user.id, finishedClockId);
    if (!finishedClock) return;

    var customerName = await apputils.getCustomerNameFromId(say, body.user.id, finishedClock.customerId);
    if (!customerName) return;

    db.deleteFinishedClock(finishedClockId);

    say(`<@${body.user.id}> Your finished session with ${customerName} was deleted`);
};
