require('dotenv').config()
const axios = require('axios');
const express = require('express')

const TELEGRAM_URL = `http://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getUpdates`;
const TELEGRAM_URL_SEND = `http://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
)

const sendMessage = async (id) => {
    await axios.post(TELEGRAM_URL_SEND + `?chat_id=${id}&text=Бот запущен и готов к работе!`)
}

let localId = 0;

const condition = (id) => {
    if(localId !== id){
        localId = id;
        return true
    }
    return false
}

const start = async () => {
    setInterval(() => {
        axios.get(TELEGRAM_URL)
            .then(response => {
                let mas = response.data.result;
                let messageText = mas[mas.length - 1].message.text
                let id = mas[mas.length - 1].message.message_id
                if(condition(id)){
                    console.log(messageText);
                }
                else{
                    return
                }                
                if (messageText === "/start") {
                    let chatId = mas[mas.length - 1].message.chat.id
                    sendMessage(chatId);
                }
            })
    }, 1000)
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await start();
})