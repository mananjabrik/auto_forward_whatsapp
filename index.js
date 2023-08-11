const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client();
const FRIENDS_LIST = require('./friend_numbers.json')
require('dotenv').config()


let continueSending = true;
const URGEN = process.env.URGENT_MAN;
const MESSAGE_TO_FRIENDS = process.env.MESSAGE_TO_SEND;
const DIRECT_MESSAGE_TO_CALLER = process.env.DIRECT_MESSAGE
const DONE = process.env.DONE_MESSAGE

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", ()=>{
    console.log('ready connect')
})

client.on('message', (msg) =>{
    console.log({from:msg.from, body: msg.body})
    if(msg.type === 'call_log' && msg.from === URGEN){
        msg.reply(DIRECT_MESSAGE_TO_CALLER)
        const interval = setInterval(() => {
            if (!continueSending) {
                clearInterval(interval);
                return;
            }            
            FRIENDS_LIST.friendNumber.forEach((e)=>{
                client.sendMessage(e, MESSAGE_TO_FRIENDS);
            })   
        }, 6000)
    }

    else if (msg.body.toLowerCase() === 'stop') {
        continueSending = false;
        FRIENDS_LIST.friendNumber.forEach((e)=>{
            client.sendMessage(e, DONE);
        })
    }
})

client.initialize();