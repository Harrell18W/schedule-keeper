const mysql = require('mysql');

// Login to MySQL db
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SK_DB_USER,
    password: process.env.SK_DB_PASSWORD,
    database: 'sk_db'
});

mysqlConnection.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL server: ' + err.stack);
        process.exit(1);
    }
    console.log('Connected to MySQL server');
});

var table_check = async function() {
    checks =
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

    for (var query of checks) {
        await mysqlConnection.query(query, function(err, results, fields) {
            if (err) console.error(err);
            console.log(results);
        });
    }

}

table_check();