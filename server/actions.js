const apputils = require('./apputils');
const blocks = require('./blocks');
const db = require('./database');
const time = require('./time');

module.exports.clockinRequestResponse = async function({ ack, say, action, body }) {
    ack();

    var responseId = action.action_id.substring(16);
    var response = await apputils.getClockinResponse(say, body.user.id, responseId);
    if (!response) return;

    var customerName = action.selected_option.text.text;

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;
    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    apputils.clockin(say, body.user.id, customerName, response.start, responseId);
    await db.deleteClockinResponse(responseId);
};

module.exports.clockinRequestCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;

    var responseId = action.action_id.substring(23);
    var response = await apputils.getClockinResponse(say, body.user.id, responseId);
    if (!response) return;

    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You do not appear to be the person who spawned this command`);
        return;
    }

    db.deleteClockinResponse(response.id);

    say(`<@${body.user.id}> Your clock in request was cancelled`);
};

module.exports.clockoutRequestResponse = async function({ ack, say, action, body }) {
    ack();

    var responseId = action.action_id.substring(16);
    var response = await apputils.getClockoutResponse(say, body.user.id, responseId);
    if (!response) return;

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;
    if (response.employeeId !== employeeId) {
        say(`<@${body.user.id}> You are not who this response was intended for.`);
        return;
    }

    var activeClockId = action.selected_option.value;
    var activeClock = await apputils.getActiveClock(say, body.user.id, activeClockId);
    if (!activeClock) return;

    if (response.finished < activeClock.start) {
        say(`<@${body.user.id}> The time you finished at is before the time you started.`);
        return;
    }

    var customer = await apputils.getCustomerNameFromId(say, body.user.id, activeClock.customerId);
    if (!customer) return;

    db.createFinishedClock(activeClock.employeeId, activeClock.customerId, activeClock.start, response.finished, activeClockId);
    db.deleteActiveClock(activeClockId);
    db.deleteClockoutResponse(responseId);

    var start = time.humanReadableDate(activeClock.start);
    var finished = time.humanReadableDate(response.finished);
    var elapsed = time.dateDifference(activeClock.start, response.finished);
    say({ blocks: blocks.clockoutResponseBlocks(customer, start, finished, elapsed, activeClockId) });
};

module.exports.clockoutRequestCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id);
    if (!employeeId) return;

    var responseId = action.action_id.substring(24);
    var response = await apputils.getClockoutResponse(say, body.user.id, responseId);
    if (!response) return;

    if (employeeId !== response.employeeId) {
        say(`<@${body.user.id}> You are not who this response was intended for.`);
        return;
    }

    db.deleteClockoutResponse(responseId);

    say(`<@${body.user.id}> Your clock out request was cancelled.`);
};

module.exports.clockoutButton = async function({ ack, say, action, body }) {
    ack();

    var end = new Date();
    apputils.clockout(say, body.user.id, end, action.value);
};

module.exports.clockoutCancel = async function({ ack, say, action, body }) {
    ack();

    var employeeId = await apputils.getEmployeeIdFromSlackUserId(say, body.user.id, action.a);
    if (!employeeId) return;

    var activeClockId = action.value;
    var activeClock = await apputils.getActiveClock(say, body.user.id, activeClockId);
    if (!activeClock) return;

    var customerName = await apputils.getCustomerNameFromId(say, body.user.id, activeClock.customerId);
    if (!customerName) return;

    db.deleteActiveClock(activeClock.id);

    say(`<@${body.user.id}> Your session with ${customerName} was cancelled.`);
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
