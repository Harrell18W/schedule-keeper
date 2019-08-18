module.exports.createActiveClock = function(employeeId, customerId, start, travel, id) {
    return 'INSERT INTO ActiveClocks ' +
           '(employeeId, customerId, start, travel, id) ' +
           'VALUES ' +
           `(${employeeId}, ${customerId}, ${start}, ${travel}, ${id});`;
};

module.exports.getActiveClock = function(id) {
    return `SELECT * FROM ActiveClocks WHERE id = ${id};`;
};

module.exports.getActiveClockFromEmployeeId = function(employeeId) {
    return `SELECT * FROM ActiveClocks WHERE employeeId = ${employeeId};`;
};

module.exports.getActiveClockFromEmployeeIdAndCustomerId = function(employeeId, customerId) {
    return `SELECT * FROM ActiveClocks WHERE employeeId = ${employeeId} AND customerId = ${customerId};`;
};

module.exports.deleteActiveClock = function(id) {
    return `DELETE FROM ActiveClocks WHERE id = ${id};`;
};

module.exports.getCustomerFromId = function(id) {
    return `SELECT * FROM Customers WHERE id = ${id};`;
};

module.exports.getCustomerIdFromName = function(name) {
    return `SELECT id FROM Customers WHERE name = ${name};`;
};

module.exports.checkIfEmployeeHasActiveClocks = function(employeeId) {
    return `SELECT id FROM ActiveClocks WHERE employeeId = ${employeeId};`;
};

module.exports.checkIfEmployeeHasClockinResponses = function(employeeId) {
    return `SELECT id FROM ClockinResponses WHERE employeeId = ${employeeId};`;
};

module.exports.checkIfEmployeeHasClockoutResponses = function(employeeId) {
    return `SELECT id FROM ClockoutResponses WHERE employeeId = ${employeeId};`;
};

module.exports.getEmployeeId = function(slackUserId) {
    return `SELECT id FROM Employees WHERE slackUserId = ${slackUserId};`;
};

module.exports.registerEmployee = function(slackUsername, slackUserId, id) {
    return 'INSERT INTO Employees ' +
           '(firstName, lastName, slackUserId, id) ' +
           'VALUES ' +
           `(${slackUsername}, "REGISTER", ${slackUserId}, ${id});`;
};

module.exports.createFinishedClock = function(employeeId, customerId, start, end, travel, id) {
    return 'INSERT INTO FinishedClocks ' +
           '(employeeId, customerId, start, end, travel, id) ' +
           'VALUES ' +
           `(${employeeId}, ${customerId}, ${start}, ${end}, ${travel}, ${id});`;
};

module.exports.getFinishedClock = function(id) {
    return `SELECT * FROM FinishedClocks WHERE id = ${id}`;
};

module.exports.deleteFinishedClock = function(id) {
    return `DELETE FROM FinishedClocks WHERE id = ${id};`;
};

module.exports.getCustomers = 'SELECT * FROM Customers ORDER BY name;';

module.exports.createClockinResponse = function(employeeId, received, start, travel, id) {
    return 'INSERT INTO ClockinResponses ' +
           '(employeeId, received, start, travel, id) ' +
           'VALUES ' +
           `(${employeeId}, ${received}, ${start}, ${travel}, ${id});`;
};

module.exports.getClockinResponse = function(id) {
    return `SELECT * FROM ClockinResponses WHERE id = ${id};`;
};

module.exports.deleteClockinResponse = function(id) {
    return `DELETE FROM ClockinResponses WHERE id = ${id};`;
};

module.exports.createClockoutResponse = function(employeeId, finished, id) {
    return 'INSERT INTO ClockoutResponses ' +
           '(employeeId, finished, id) ' +
           'VALUES ' +
           `(${employeeId}, ${finished}, ${id});`;
};

module.exports.getClockoutResponse = function(id) {
    return `SELECT * FROM ClockoutResponses WHERE id = ${id};`;
};

module.exports.deleteClockoutResponse = function(id) {
    return `DELETE FROM ClockoutResponses WHERE id = ${id};`;
};

module.exports.checks = 
[
    '\
    CREATE TABLE IF NOT EXISTS Customers (\
        name VARCHAR(255) NOT NULL,\
        customShorthands JSON NOT NULL,\
        id CHAR(32) NOT NULL\
    );',
    
    '\
    CREATE TABLE IF NOT EXISTS Employees (\
        firstName VARCHAR(255) NOT NULL,\
        lastName VARCHAR(255) NOT NULL,\
        email VARCHAR(255),\
        phone VARCHAR(13),\
        slackUserId CHAR(9) NOT NULL,\
        id CHAR(32) NOT NULL\
    );',

    '\
    CREATE TABLE IF NOT EXISTS ActiveClocks (\
        employeeId CHAR(32) NOT NULL,\
        customerId CHAR(32) NOT NULL,\
        start DATETIME NOT NULL,\
        travel BOOLEAN NOT NULL,\
        id CHAR(32) NOT NULL\
    );',

    '\
    CREATE TABLE IF NOT EXISTS FinishedClocks (\
        employeeId CHAR(32) NOT NULL,\
        customerId CHAR(32) NOT NULL,\
        start DATETIME NOT NULL,\
        end DATETIME NOT NULL,\
        travel BOOLEAN NOT NULL,\
        id CHAR(32) NOT NULL\
    );',

    '\
    CREATE TABLE IF NOT EXISTS ClockinResponses (\
        employeeId CHAR(32) NOT NULL,\
        received DATETIME NOT NULL,\
        start DATETIME NOT NULL,\
        travel BOOLEAN NOT NULL,\
        id CHAR(32) NOT NULL\
    );',

    '\
    CREATE TABLE IF NOT EXISTS ClockoutResponses (\
        employeeId CHAR(32) NOT NULL,\
        finished DATETIME NOT NULL,\
        id CHAR(32) NOT NULL\
    );'
];
