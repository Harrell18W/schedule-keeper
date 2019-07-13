module.exports.createActiveClock = function(employeeId, customerId, start, id) {
    return 'INSERT INTO ActiveClocks ' +
           '(employeeId, customerId, start, id) ' +
           'VALUES ' +
           `("${employeeId}", "${customerId}", "${start}", "${id}");`;
};

module.exports.getActiveClockFromEmployeeId = function(employeeId) {
    return `SELECT * FROM ActiveClocks WHERE employeeId = "${employeeId}";`;
};

module.exports.deleteActiveClock = function(id) {
    return `DELETE FROM ActiveClocks WHERE id = "${id}";`;
};

module.exports.getCustomerFromId = function(id) {
    return `SELECT * FROM Customers WHERE id = "${id}";`;
};

module.exports.getCustomerIdFromName = function(name) {
    return `SELECT id FROM Customers WHERE name = "${name}";`;
};

module.exports.checkIfEmployeeHasActiveClocks = function(employeeId) {
    return `SELECT id FROM ActiveClocks WHERE employeeId = "${employeeId}";`;
};

module.exports.checkIfEmployeeHasSlackResponses = function(employeeId) {
    return `SELECT id FROM SlackResponses WHERE employeeId = "${employeeId}";`;
};

module.exports.getEmployeeId = function(slackUserId) {
    return `SELECT id FROM Employees WHERE slackUserId = "${slackUserId}";`;
};

module.exports.createFinishedClock = function(employeeId, customerId, start, end, id) {
    return 'INSERT INTO FinishedClocks ' +
           '(employeeId, customerId, start, end, id) ' +
           'VALUES ' +
           `("${employeeId}", "${customerId}", "${start}", "${end}", "${id}");`;
};

module.exports.getFinishedClock = function(id) {
    return `SELECT * FROM FinishedClocks WHERE id = "${id}";`;
};

module.exports.deleteFinishedClock = function(id) {
    return `DELETE FROM FinishedClocks WHERE id = "${id}";`;
};

module.exports.getCustomers = 'SELECT * FROM Customers;';

module.exports.createResponse = function(employeeId, received, start, id) {
    return 'INSERT INTO SlackResponses ' +
           '(employeeId, received, start, id) ' +
           'VALUES ' +
           `("${employeeId}", "${received}", "${start}", "${id}");`;
};

module.exports.getResponse = function(id) {
    return `SELECT * FROM SlackResponses WHERE id = "${id}";`;
};

module.exports.deleteResponse = function(id) {
    return `DELETE FROM SlackResponses WHERE id = "${id}";`;
};

module.exports.checks = 
[
    '\
    CREATE TABLE IF NOT EXISTS Customers (\
        name VARCHAR(255) NOT NULL,\
        customShorthands JSON NOT NULL,\
        id CHAR(32) NOT NULL\
    )',
    
    '\
    CREATE TABLE IF NOT EXISTS Employees (\
        firstName VARCHAR(255) NOT NULL,\
        lastName VARCHAR(255) NOT NULL,\
        email VARCHAR(255),\
        phone INT,\
        slackUserId CHAR(9) NOT NULL,\
        id CHAR(32) NOT NULL\
    )',

    '\
    CREATE TABLE IF NOT EXISTS ActiveClocks (\
        employeeId CHAR(32) NOT NULL,\
        customerId CHAR(32) NOT NULL,\
        start DATETIME NOT NULL,\
        id CHAR(32) NOT NULL\
    )',

    '\
    CREATE TABLE IF NOT EXISTS FinishedClocks (\
        employeeId CHAR(32) NOT NULL,\
        customerId CHAR(32) NOT NULL,\
        start DATETIME NOT NULL,\
        end DATETIME NOT NULL,\
        id CHAR(32) NOT NULL\
    )',

    '\
    CREATE TABLE IF NOT EXISTS HandledClocks (\
        employeeId CHAR(32) NOT NULL,\
        customerId CHAR(32) NOT NULL,\
        start DATETIME NOT NULL,\
        end DATETIME NOT NULL,\
        handledOn DATETIME NOT NULL,\
        id CHAR(32) NOT NULL\
    )',

    '\
    CREATE TABLE IF NOT EXISTS SlackResponses (\
        employeeId CHAR(32) NOT NULL,\
        received DATETIME NOT NULL,\
        start DATETIME NOT NULL,\
        id CHAR(32) NOT NULL\
    )'
];