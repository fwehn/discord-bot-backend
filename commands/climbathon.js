const axios = require("axios");

const commandData = {
    name: "climbathon",
    description: "Aktuelle Standings des Climbathons."
}

function commandCallback(){
    return new Promise((resolve, reject) => {
        axios.get('https://challenger-api.noway.gg/leaderboard')
            .then((res) => {
                let data = res["data"];
                let fields = [];

                for (let i in data){
                    let pos = parseInt(i)+1;

                    fields.push({
                        name: `${pos}. ${data[i]["name"]}`,
                        value: `${data[i]["tier"]} ${data[i]["leaguePoints"]} LP`
                    })
                }

                resolve({
                    type: "embed",
                    content: [{
                        title: "Climbathon",
                        description: "Hier die Standings des Climbathons:",
                        fields: fields
                    }]
                });

            }).catch(reject);
    });
}

module.exports = {
    commandData, commandCallback
}