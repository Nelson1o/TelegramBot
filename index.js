require('dotenv').config()
const axios = require('axios');
const express = require('express')

class TelegramBot {
    constructor(token) {
        this.token = token;
    }

    getURL = (type) => {
        switch (type) {
            case 1:
                return `http://api.telegram.org/bot${this.token}/getUpdates`
            case 2:
                return `http://api.telegram.org/bot${this.token}/sendMessage`
            default:
                break;
        }
    }

    postMessage(message) {
        console.log(message);
    }

    sendMessage = async (id) => {
        await axios.post(this.getURL(2) + `?chat_id=${id}&text=Бот запущен и готов к работе!`)
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

let localId = 0;

condition = (id) => {
    if (localId !== id) {
        localId = id;
        return true
    }
    return false
}

const start = async () => {
    setInterval(() => {
        axios.get(Bot.getURL(1))
            .then(response => {
                let mas = response.data.result;
                let messageText = mas[mas.length - 1].message.text
                let id = mas[mas.length - 1].message.message_id
                if (condition(id)) {
                    Bot.postMessage(messageText)
                }
                else {
                    return
                }
                if (messageText === "/start") {
                    let chatId = mas[mas.length - 1].message.chat.id
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