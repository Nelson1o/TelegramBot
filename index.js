require('dotenv').config()
const axios = require('axios');
const express = require('express')

class TelegramBot{
    app = express();
    localId = 0;

    constructor(token, port){
        this.token = token;
        this.port = port || 3000;
    }

    getURL(type){
        switch (type) {
            case 1:
                return `http://api.telegram.org/bot${this.token}/getUpdates`
            case 2:
                return `http://api.telegram.org/bot${this.token}/sendMessage`
            default:
                break;
        }
    }

    listen(){
        this.app.use(express.json());
        this.app.use(
            express.urlencoded({
                extended: true
            })
        )

        this.app.listen(this.port, async () => {
            console.log(`Server running on port ${this.port}`);
            await this.start();
        })
    }

    start = async () => {
        setInterval(() => {
            axios.get(this.getURL(1))
                .then(response => {
                    let mas = response.data.result;
                    let messageText = mas[mas.length - 1].message.text
                    let id = mas[mas.length - 1].message.message_id
                    if(this.condition(id)){
                        console.log(messageText);
                    }
                    else{
                        return
                    }                
                    if (messageText === "/start") {
                        let chatId = mas[mas.length - 1].message.chat.id
                        this.sendMessage(chatId);
                    }
                })
        }, 1000)
    }

    sendMessage = async (id) => {
        await axios.post(this.getURL(2) + `?chat_id=${id}&text=Бот запущен и готов к работе!`)
    }

    condition = (id) => {
        if(this.localId !== id){
            this.localId = id;
            return true
        }
        return false
    }
}

const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, process.env.PORT);
Bot.listen();