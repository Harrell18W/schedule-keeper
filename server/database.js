const mysql = require('mysql');
const util = require('util');

const errors = require('./errors');
const queries = require('./queries');

function escapeArgs(args) {
    var escapedArgs = [];
    for (var arg of args)
        escapedArgs.push(mysql.escape(arg));
    return escapedArgs;
}

// Login to MySQL db
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SK_DB_USER,
    password: process.env.SK_DB_PASSWORD,
    database: 'sk_db'
});

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

module.exports.tableCheck = function() {
    for (var query of queries.checks) {
        mysqlConnection.query(query, function(err) {
            if (err) console.error(err);
        });
    }
};

module.exports.createActiveClock = async function(employeeId, customerId, start, id) {
    [employeeId, customerId, start, id] = escapeArgs(arguments);
    query(queries.createActiveClock(employeeId, customerId, start, id));
};

module.exports.getActiveClockFromEmployeeId = async function(employeeId) {
    [employeeId] = escapeArgs(arguments);
    var results = await query(queries.getActiveClockFromEmployeeId(employeeId));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry found in ActiveClock found with employeeId ${employeeId}`);
    }
    return results[0];
};

module.exports.deleteActiveClock = async function(id) {
    [id] = escapeArgs(arguments);
    query(queries.deleteActiveClock(id));
};

module.exports.checkIfEmployeeHasActiveClocks = async function(employeeId) {
    [employeeId] = escapeArgs(arguments);
    return Boolean((await query(queries.checkIfEmployeeHasActiveClocks(employeeId))).length);
};

module.exports.checkIfEmployeeHasSlackResponses = async function(employeeId) {
    [employeeId] = escapeArgs(arguments);
    return Boolean((await query(queries.checkIfEmployeeHasSlackResponses(employeeId))).length);
};

module.exports.getEmployeeIdFromSlackUserId = async function(slackUserId) {
    [slackUserId] = escapeArgs(arguments);
    var results = await query(queries.getEmployeeId(slackUserId));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Employees found with slackUserId ${slackUserId}`);
    }
    return results[0].id;
};

module.exports.registerEmployee = async function(slackUsername, slackUserId, id) {
    [slackUsername, slackUserId, id] = escapeArgs(arguments);
    if ((await query(queries.getEmployeeId(slackUserId))).length > 0) {
        throw new errors.EntryAlreadyExistsError(`Employee with Slack ID ${slackUserId} already registered`);
    }
    slackUserId = '\'R' + slackUserId.substring(2);
    if ((await query(queries.getEmployeeId(slackUserId))).length > 0) {
        throw new errors.EntryAlreadyExistsError(`Employee with Slack ID ${slackUserId} has already tried to register`);
    }
    query(queries.registerEmployee(slackUsername, slackUserId, id));
};

module.exports.getCustomerFromId = async function(id) {
    [id] = escapeArgs(arguments);
    var results = await query(queries.getCustomerFromId(id));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry found in Customers with id ${id}`);
    }
    return results[0];
};

module.exports.getCustomerIdFromName = async function(name) {
    [name] = escapeArgs(arguments);
    var results = await query(queries.getCustomerIdFromName(name));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Customers found with name ${name}`);
    }
    return results[0].id;
};

module.exports.getCustomers = async function() {
    return await query(queries.getCustomers);
};

module.exports.searchCustomers = async function(identifier) {
    [identifier] = escapeArgs(arguments);
    identifier = identifier.toLowerCase().substring(1, identifier.length - 1);
    var results = await this.getCustomers();
    for (var customer of results) {
        if (identifier == customer.name.toLowerCase() || customer.customShorthands.indexOf(identifier.toUpperCase()) > -1) {
            return customer;
        }
    }
    return null;
};

module.exports.createFinishedClock = async function(employeeId, customerId, start, finished, id) {
    [employeeId, customerId, start, finished, id] = escapeArgs(arguments); 
    query(queries.createFinishedClock(employeeId, customerId, start, finished, id));
};

module.exports.getFinishedClock = async function(id) {
    [id] = escapeArgs(arguments);
    var results = await query(queries.getFinishedClock(id));
    if (results.length < 1) {
        throw new errors.EntryNotFoundError(`No entry in FInishedClocks found with id ${id}`);
    }
    return results[0];
};

module.exports.deleteFinishedClock = async function(id) {
    [id] = escapeArgs(arguments);
    query(queries.deleteFinishedClock(id));
};

module.exports.createResponse = async function(employeeId, received, start, id) {
    [employeeId, received, start, id] = escapeArgs(arguments);
    query(queries.createResponse(employeeId, received, start, id));
};

module.exports.getResponse = async function(id) {
    [id] = escapeArgs(arguments);
    var results = await query(queries.getResponse(id));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in SlackResponses found with id ${id}`);
    }
    return results[0];
};

module.exports.deleteResponse = async function(id) {
    [id] = escapeArgs(arguments);
    query(queries.deleteResponse(id));
};

this.tableCheck();
