//TODO prevent SQL injections
const mysql = require('mysql');
const util = require('util');

const errors = require('./errors');
const queries = require('./queries');

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
        mysqlConnection.query(query, function(err, results, fields) {
            if (err) console.error(err);
        });
    }

}

module.exports.createActiveClock = async function(employeeId, customerId, start, id) {

    query(queries.createActiveClock(employeeId, customerId, start, id));

}

module.exports.getActiveClockFromEmployeeId = async function(employeeId) {

    var results = await query(queries.getActiveClockFromEmployeeId(employeeId));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry found in ActiveClock found with employeeId ${employeeId}`);
    }
    return results[0];

}

module.exports.deleteActiveClock = async function(id) {

    query(queries.deleteActiveClock(id));

}

module.exports.getEmployeeIdFromSlackUserId = async function(slackUserId) {
    
    var results = await query(queries.getEmployeeId(slackUserId));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Employees found with slackUserId ${slackUserId}`);
    }
    return results[0].id;

}

module.exports.getCustomerFromId = async function(id) {

    var results = await query(queries.getCustomerFromId(id));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry found in Customers wiht id ${id}`);
    }
    return results[0];

}

module.exports.getCustomerIdFromName = async function(name) {

    var results = await query(queries.getCustomerIdFromName(name));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Customers found with name ${name}`);
    }
    return results[0].id;

}

module.exports.getCustomers = async function() {

    return await query(queries.getCustomerNames);

}

module.exports.createFinishedClock = async function(employeeId, customerId, start, finished, id) {
    
    query(queries.createFinishedClock(employeeId, customerId, start, finished, id));

}

//TODO check parameters, error handling
module.exports.createResponse = async function(employeeId, received, start, id) {

    query(queries.createResponse(employeeId, received, start, id));

}

module.exports.getResponse = async function(id) {

    var results = await query(queries.getResponse(id));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in SlackResponses found with id ${id}`);
    }
    return results[0];

}

//TODO check parameters, error handling
module.exports.deleteResponse = async function(id) {

    query(queries.deleteResponse(id));

}

module.exports.tableCheck();