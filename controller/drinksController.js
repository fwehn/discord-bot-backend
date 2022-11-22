const db = require("../database");

function createDrink(name, amount, proof, userId, serverId){
    return new Promise((resolve, reject) => {
        getCurrentListId(serverId).then(listId => {
            let sql = `INSERT INTO drink(name, amount,  proof, pure, userId, listId) VALUES ("${name}", ${amount}, ${proof}, ${amount*proof/100}, ${userId}, ${listId});`;

            // todo resolve with funny message
            db.sendRequest(sql).then(resolve).catch(reject);
        }).catch(reject);
    });
}

function getCurrentListId(serverId){
    let sql = `SELECT id FROM list WHERE serverId=${serverId} AND DATEDIFF(date, "${new Date().toISOString()}")=0`;

    return new Promise((resolve, reject) => {
        db.sendRequest(sql).then(data => {
            if (data.length !== 0) resolve(data[0]["id"]);
            else createList(serverId).then(data => resolve(data["insertId"]));
        }).catch(reject);
    });
}

function createList(serverId, eventId){
    let sql;
    if (!eventId){
        sql = `INSERT INTO list(serverId) VALUES ("${serverId}")`;
    }else{
        sql = `INSERT INTO list(serverId, eventId) VALUES ("${serverId}", "${eventId}")`;
    }
    return db.sendRequest(sql);
}

module.exports = {
    createDrink
}