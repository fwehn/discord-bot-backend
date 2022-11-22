const mysql = require("mysql");

let pool = mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSERNAME || "username",
    password: process.env.MYSQLPASSWORD || "password",
    database: process.env.MYSQLDATABASE || "discordBot"
});

function init(){
    // Create Tables
    //TODO create all other Tables
    let list = `CREATE TABLE IF NOT EXISTS list(id INT NOT NULL AUTO_INCREMENT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, serverId VARCHAR(20) NOT NULL, eventId VARCHAR(20) ,PRIMARY KEY (id));`;
    let drink = `CREATE TABLE IF NOT EXISTS drink(
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(32) NOT NULL,
                    amount FLOAT(4, 4) NOT NULL,
                    proof INT NOT NULL,
                    pure FLOAT(4, 4) NOT NULL,
                    userId VARCHAR(20) NOT NULL,
                    listId INT NOT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (listId) REFERENCES list(id) ON DELETE CASCADE
                )`;

    return new Promise(async (resolve, reject) => {
        try{
            await sendRequest(list);
            await sendRequest(drink);
            resolve("Database initialized!");
        }catch (err) {
            reject(err);
        }
    });
}

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
    init, sendRequest
}