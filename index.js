const TelegramApi = require('node-telegram-bot-api')

const token = '5677756025:AAHL7TeUpB6qMJqth7bN6gKQ7FRIA8HsvBE'

const bot = new TelegramApi(token, {polling: true})

bot.on("message", msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    if(text === '/start'){
        bot.sendMessage(chatId, "Бот запущен и готов к работе!");
    }

    bot.sendMessage(chatId, `Твое сообщение ${text}`);
    console.log(`${userName} message: ${text}`);
})