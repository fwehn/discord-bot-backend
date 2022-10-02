const mysql = require("mysql");

let pool = mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSERNAME || "username",
    password: process.env.MYSQLPASSWORD || "password",
    database: process.env.MYSQLDATABASE || "discordBot"
});

function sendRequest(sql){
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            try {
                if (connection) {
                    connection.query(sql, (err, result) => {
                        if (err) reject(err);

                        resolve(result);
                        connection.release();
                    });
                }else{
                    reject("Not connected to database");
                }
            } catch (err) {
                reject(err);
            }

        });
    });
}

module.exports = {
    sendRequest
}