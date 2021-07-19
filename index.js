const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./buttons.js')
const token = '1913490607:AAEzztOsiHI_8RAEqEPc07ACKgwoaLc3dBQ';

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Я выбираю цифру от 0 до 9! Твоя задача угадать ее.'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Угадывай.', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие!' },
    { command: '/info', description: 'Приветствие!' },
    { command: '/game', description: 'Приветствие!' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Привет!');
      return bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/fdb/2c3/fdb2c3d5-ae19-3b60-8ffc-7b3b8099cfe5/27.webp'
      );
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Неверная команда.');
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === 'again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}!`, againOptions)
    } else {
      return bot.sendMessage(chatId, `Ты не отгадал, цифра была ${chats[chatId]}!`, againOptions)
    } 
    console.log(msg)
  })

};

start();
