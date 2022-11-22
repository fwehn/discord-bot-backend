const axios = require('axios');

const commandData = {
    name: "prost",
    description: "Schreib dein Getränk auf!",
    options: [
        {
            name: "amount",
            description: "Menge deines Getränks!",
            type: 10,
            required: true,
            choices: [
                {name: "2cl", value: 0.2},
                {name: "4cl", value: 0.04},
                {name: "100ml", value: 0.1},
                {name: "200ml", value: 0.2},
                {name: "250ml", value: 0.25},
                {name: "330ml", value: 0.33},
                {name: "500ml", value: 0.5},
                {name: "700ml", value: 0.7}
            ]
        },
        {
            name: "proof",
            description: "Alkoholgehalt deines Getränks!",
            type: 4,
            required: true,
            choices: [
                {name: "2% für die dies brauchen....", value: 2},
                {name: "5%", value: 5},
                {name: "12%", value: 12},
                {name: "18%", value: 17},
                {name: "30%", value: 30},
                {name: "35%", value: 35},
                {name: "40%", value: 40},
                {name: "45%", value: 45}
            ]
        },
        {
            name: "name",
            description: "Name deines Getränks!",
            type: 3,
            required: true
        }
    ]
};

function commandCallback(interaction){
    let sendMessage = true; //TODO set when weather its input is realistic or not
    let options = interaction.options;

    let dataObject = {
        userId: interaction.member.id,
        username: interaction.member.user.username,
        nickname: interaction.member.nickname || "",
        amount: options.getNumber("amount", true),
        proof: options.getInteger("proof", true),
        name: options.getString("name", true)
    }

    return new Promise((resolve, reject) => {
        if (sendMessage){
            axios.post(`http://127.0.0.1:${process.env.PORT}/server/${interaction.guildId}/drinks`, dataObject)
                .then((res) => {
                    resolve({type: "private", content: res.data["message"]});
                })
                .catch(reject);
        }else{
            resolve({type: "private", content: "Sei ehrlich!"});
        }

    })
}

module.exports = {
    commandData, commandCallback
}