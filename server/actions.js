const blocks = require(`./blocks`);
const errors = require('./errors');
const db = require('./database');
const time = require('./time');

//TODO add cancel and clockout button
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

    say({ blocks: blocks.clockinReponseBlocks(customerName, hrDate)});
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