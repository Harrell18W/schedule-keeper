const mysql = require('mysql');

const queries = require('./queries');

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

module.exports.tableCheck = async function() {

    for (var query of queries.checks) {
        await mysqlConnection.query(query, function(err, results, fields) {
            if (err) console.error(err);
            console.log(results);
        });
    }

}