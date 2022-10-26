require('dotenv').config()
const axios = require('axios');
const express = require('express');
const path = require('path');
const fs = require('fs');

const GET_UPDATES = 'GET_UPDATES';
const SEND_MESSAGE = 'SEND_MESSAGE';

class TelegramBot {
    localObj;

    constructor(token) {
        this.token = token;
    }

    getURL = (type) => {
        switch (type) {
            case GET_UPDATES:
                return `http://api.telegram.org/bot${this.token}/getUpdates`;
            case SEND_MESSAGE:
                return `http://api.telegram.org/bot${this.token}/sendMessage`;
            default:
                break;
        }
    }

    postMessage() {
        app.get("/api/getMessage", (req, res) => {
            let data = this.getObj();
            res.send(data);
        })
    }

    sendMessage = async (id) => {
        await axios.post(this.getURL('SEND_MESSAGE') + `?chat_id=${id}&text=Бот запущен и готов к работе!`);
    }

    getObj() {
        return this.localObj;
    }

    setObj(obj) {
        this.localObj = Object.assign({}, obj);
    }
}

const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.static(path.resolve(__dirname, 'public')));

let localId = 0;

const condition = (id) => {
    if (localId !== id) {
        localId = id;
        return true;
    }
    return false;
}

const start = async () => {
    setInterval(() => {
        axios.get(Bot.getURL("GET_UPDATES"))
            .then(response => {
                let mas = response.data.result;
                let messageText = mas[mas.length - 1].message.text;
                let messageStruct = {
                    id: mas[mas.length - 1].update_id,
                    name: mas[mas.length - 1].message.from.first_name,
                    text: mas[mas.length - 1].message.text,
                    time: mas[mas.length - 1].message.date
                }
                let id = mas[mas.length - 1].message.message_id;
                if (condition(id)) {
                    Bot.setObj(messageStruct);
                    Bot.postMessage();
                }
                else {
                    return;
                }
                if (messageText === "/start") {
                    let chatId = mas[mas.length - 1].message.chat.id;
                    Bot.sendMessage(chatId);
                }
            })
    }, 1000)
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await start();
})