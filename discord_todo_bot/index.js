require('dotenv').config()
const { Client, Collection, Events, IntentsBitField } = require("discord.js")
const fs = require('node:fs')
const path = require('node:path')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath)
    
    if(commandFiles.length===0) continue;
    
    commandFiles.filter(file => file.endsWith('.js'))

    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)

        if('data' in command && 'excute' in command){
            client.commands.set(command.data.name, command)
        }else{
            console.log(`❗️The command at ${filePath} is missing a required "data" or "excute" property.`)
        }
    }
}

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles){
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if(event.once){
        client.once(event.name, (...args) => event.excute(...args))
    }else{
        client.on(event.name, (...args) => event.excute(...args))
    }
}

client.login(process.env.TOKEN)
