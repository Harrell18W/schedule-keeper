const Employee = require('./models/employee');

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