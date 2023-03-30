require('dotenv/config');
const { Client, IntentsBitField, MessageActivityType } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
  
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


client.on('messageCreate',async (message) =>{
  if(message.author.bot) return;
  if(message.content.startsWith('!')) return;
  if(message.channel.id !== process.env.CHANNEL_ID) return;
  let  conversationLog = [{role:'system', content:'You are a friendly chatbot' }];

  await  message.channel.sendTyping();

  let previousMessage = await message.channel.messages.fetch({limit:15});
  previousMessage.reverse;
  previousMessage.forEach((msg)=>{
    if(message.content.startsWith('!')) return;
    if(msg.author.id !== client.user.id && msg.author.bot) return;
    if(msg.author.id !== message.author.id)  return;
    conversationLog.push({
      role:'user',
      content:msg.content
    });

  });


  

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages:conversationLog,

  });

  message.reply(result.data.choices[0].message);

});
 client.login((process.env.DISCORD_TOKEN));