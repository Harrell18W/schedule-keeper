//TODO prevent SQL injections
//TODO consistent use of promisified query
const mysql = require('mysql');
const util = require('util');

const errors = require('./errors');

const Customer = require('./models/customer');
const Employee = require('./models/employee');
const queries = require('./queries');

// Login to MySQL db
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SK_DB_USER,
    password: process.env.SK_DB_PASSWORD,
    database: 'sk_db'
});

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

module.exports.insertQuery = function(object) {
    if (typeof object.insertQuery !== 'function') {
        throw new Error('insertQuery must receive an object with method insertQuery(db)');
    }
    object.insertQuery(query);
}

module.exports.findObjectQuery = function(object) {
    if (typeof object.findQuery !== 'function') {
        throw new Error('findQuery must receive an object with method insertQuery(db)');
    }
    object.findQuery(query);
}

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

module.exports.getEmployeeId = async function(slackUserId) {
    
    var results = await query(queries.getEmployeeId(slackUserId));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Employees found with slackUserId ${slackUserId}`);
    }
    return results[0].id;

}

module.exports.getCustomerIdFromName = async function(name) {

    var results = await query(queries.getCustomerIdFromName(name));
    if (results.length !== 1) {
        throw new errors.EntryNotFoundError(`No entry in Customers found with name ${name}`);
    }
    return results[0].id;

}

module.exports.getCustomerNames = async function() {

    return await query(queries.getCustomerNames);

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