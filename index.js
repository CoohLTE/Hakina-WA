const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, delay, downloadContentFromMessage, DisconnectReason, templateMessage, MediaType, GroupSettingChange, isBaileys, WASocket, WAProto, getStream, relayWAMessage, Miimetype, proto, mentionedJid, processTime, MessageTypeProto, BufferJSON, GroupMetadata, getContentType } = require("@adiwajshing/baileys")

const { menu1 } = require("./arquivos/Menus/Menu")
const P = require("pino")
const fs = require("fs")
const util = require("util")
const clui = require("clui")
const ms = require("ms")
const yts = require("yt-search")
const speed = require("performance-now")
const fetch = require("node-fetch")
const axios = require("axios")
const webp = require("node-webpmux")
const chalk = require("chalk")
const cfonts = require("cfonts")
const moment = require("moment-timezone")
const ffmpeg = require("fluent-ffmpeg")
const { Boom } = require("@hapi/boom")

const { PIX } = require('gpix/dist')
const Canvas = require('canvas')

const { exec, spawn, execSync } = require("child_process")
const { getBuffer, generateMessageTag, tempRuntime, clockString, color, fetchJson, getGroupAdmins, getRandom, parseMention, getExtension, banner, uncache, nocache, isFiltered, addFilter, ia, msFunction } = require('./arquivos/funções/ferramentas')
const { prefixo, nomebot, nomedono, numerodono } = require('./arquivos/funções/configuração.json')

const options = { timeZone: 'America/Sao_Paulo', hour12: false }
const data = new Date().toLocaleDateString('pt-BR', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
const hora = new Date().toLocaleTimeString('pt-BR', options)
const horaAtual = new Date().getHours()
const varping = speed()
const ping = speed() - varping
const timestamp = speed()
const latensi = speed() - timestamp
const ascii = require('ascii-table')
const UserSchema = require('./arquivos/SchemaDB/User')
const RoubarSchema = require("./arquivos/SchemaDB/Roubar")

const hercai = require('hercai')
const { resolve } = require("path")


const table = new ascii(`Arquivos Em Funcionamentos`)

//Conexão
const MAX_RECONNECTION_ATTEMPTS = 3
let reconnectionAttempts = 0
async function connectToWhatsApp() {

    const store = makeInMemoryStore({
        logger: P().child({ level: "silent", stream: "store" })
    })
    console.log(banner.string)
    const { state, saveCreds } = await useMultiFileAuthState('./arquivos/qr-code')
    const cooh = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        browser: ['HakinaMD', 'macOS', 'desktop'],
        auth: state
    })
    cooh.ev.on("creds.update", saveCreds)
    store.bind(cooh.ev)
    cooh.ev.on("chats.set", () => {
        console.log("Tem conversas", store.chats.all())
    })
    cooh.ev.on("contacts.set", () => {
        console.log("Tem contatos", Object.values(store.contacts))
    })
    cooh.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            const shouldReconnect = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            console.log("Conexão fechada erro:", lastDisconnect.error, "Tentando reconectar...", shouldReconnect)
            if (shouldReconnect && reconnectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
                reconnectionAttempts++
                setTimeout(connectToWhatsApp, 5000)
            } else {
                console.log("Falha na reconexão. Limite máximo de tentativas atingido.")
            }
        } else if (connection === "open") {

            table.setHeading("Arquivo", "Status")

            fs.readdirSync(`./arquivos/Functions/`).forEach((dir) => {
                const files1 = fs.readdirSync(`./arquivos/Functions/${dir}/`).filter((file) => file.endsWith('.js'))
                const arquivo = require(`./arquivos/Functions/${dir}/${files1}`)
                for (let file of files1) {
                    table.addRow(file, `✅`)
                }
            })

            console.log('\n\n')
            console.log(table.toString())
            console.log('\n\n')

            console.log(color(`➱ Conectado com sucesso!\n• Status: online\n• Horário ligado: ${hora}\n• Bem-vindo ao ${nomebot}\n➱ Próximos logs...\n`, 'green'))
        }
    })
    cooh.ev.on('messages.upsert', async (m) => {

        //Visualização da mensagem, etc...
        try {
            const info = m.messages[0]
            if (!info.message) return
            await cooh.readMessages([info.key])
            if (info.key && info.key.remoteJid == 'status@broadcast') return
            const type = Object.keys(info.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(info.message)[2] : (Object.keys(info.message)[0] == 'messageContextInfo') ? Object.keys(info.message)[1] : Object.keys(info.message)[0]
            const content = JSON.stringify(info.message)
            const from = info.key.remoteJid

            var body = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : ''

            const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

            var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

            //Const isGroup, etc...
            const isGroup = info.key.remoteJid.endsWith('@g.us')
            const sender = isGroup ? info.key.participant : info.key.remoteJid
            const groupMetadata = isGroup ? await cooh.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupDesc = isGroup ? groupMetadata.desc : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const nome = info.pushName ? info.pushName : ''
            const pushname = info.pushName ? info.pushName : ''
            const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const q = args.join(' ')
            const isCmd = body.startsWith(prefixo)
            const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
            const mentions = (teks, memberr, id) => {
                (id == null || id == undefined || id == false) ? cooh.sendMessage(from, { text: teks.trim(), mentions: memberr }) : cooh.sendMessage(from, { text: teks.trim(), mentions: memberr })
            }
            const quoted = info.quoted ? info.quoted : info
            const mime = (quoted.info || quoted).mimetype || ""
            const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

            //Outras const...
            const isBot = info.key.fromMe ? true : false
            const isOwner = numerodono.includes(sender)
            const BotNumber = cooh.user.id.split(':')[0] + '@s.whatsapp.net'
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isBotGroupAdmins = groupAdmins.includes(BotNumber) || false
            const isRegistro = await UserSchema.findOne({ telefone: `${sender.split("@")[0]}` }) ? true : false
            const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) }
            const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'

            const enviar = (text) => {
                cooh.sendMessage(from, { text: text }, { quoted: info })
            }

            //Const isQuoted.
            const isImage = type == "imageMessage"
            const isVideo = type == "videoMessage"
            const isAudio = type == "audioMessage"
            const isSticker = type == "stickerMessage"
            const isContact = type == "contactMessage"
            const isLocation = type == "locationMessage"
            const isProduct = type == "productMessage"
            const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage")
            typeMessage = body.substr(0, 50).replace(/\n/g, "")
            if (isImage) typeMessage = "Image"
            else if (isVideo) typeMessage = "Video"
            else if (isAudio) typeMessage = "Audio"
            else if (isSticker) typeMessage = "Sticker"
            else if (isContact) typeMessage = "Contact"
            else if (isLocation) typeMessage = "Location"
            else if (isProduct) typeMessage = "Product"
            const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
            const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
            const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
            const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
            const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
            const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
            const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
            const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
            const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")

            const verificado = { "key": { "fromMe": false, "participant": "0@s.whatsapp.net", "remoteJid": "552796100962@g.us" }, "message": { orderMessage: { itemCount: 9999, status: 4, thumbnail: fs.readFileSync(`./arquivos/Fotos/Verificado.png`), message: `Hakina`, surface: 100, sellerJid: "0@s.whatsapp.net" } } }

            //Obtém o conteúdo de um arquivo em formato de buffer
            const getFileBuffer = async (mediakey, MediaType) => {
                const stream = await downloadContentFromMessage(mediakey, MediaType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                return buffer
            }

            //Respostas de verificação
            var resposta = {
                espere: "Por favor, aguarde um momento...",
                registro: `Olá ${nome}, parece que você ainda não está registrado. Para fazer seu registro, utilize o comando ${prefixo}rg.`,
                rg: "Oops! Parece que você já está registrado. Não é possível ter mais de um registro por usuário.",
                premium: "Lamentamos, mas você não possui uma assinatura Premium. Este comando é exclusivo para usuários na lista Premium. Aproveite todos os benefícios de se tornar Premium!",
                bot: "Este comando só pode ser executado pelo bot.",
                dono: "Desculpe, mas apenas o dono do bot pode utilizar este comando.",
                grupo: "Este comando só pode ser utilizado em grupos.",
                privado: "Este comando só pode ser utilizado em conversas privadas.",
                adm: "Apenas administradores do grupo podem utilizar este comando.",
                botadm: "Este comando só pode ser utilizado quando o bot é um administrador do grupo.",
                erro: "Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde."
            }

            var status_msg = {
                check: 'check',
                warning: 'warning',
                error: 'error'
            }

            //Verificação anti-spam
            if (isCmd) {
                if (isFiltered(sender)) {
                    return enviar('Sem flood amigo... agora espere 5 segundos.')
                } else {
                    addFilter(sender)
                }
            }

            //Mensagens do console
            if (isGroup) {
                if (isCmd && !isBot) {
                    console.log(
                        color(`\n ⟨ Comando em grupo ⟩`, 'yellow'),
                        color(`\n➱ Comando: ${comando}`, 'green'),
                        color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
                        color(`\n➱ Grupo: ${groupName} (${from.split("@g.us")[0]})`, 'green'),
                        color(`\n➱ Nome: ${nome}`, 'green'),
                        color(`\n➱ Hora: ${hora}\n`, 'green'))
                } else if (!isBot) {
                    console.log(
                        color(`\n ⟨ Mensagem em grupo ⟩`, 'yellow'),
                        color(`\n➱ Comando: ${color('Não', 'red')}`, 'green'),
                        color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
                        color(`\n➱ Grupo: ${groupName} (${from.split("@g.us")[0]})`, 'green'),
                        color(`\n➱ Nome: ${nome}`, 'green'),
                        color(`\n➱ Hora: ${hora}\n`, 'green'))
                }
            } else {
                if (isCmd && !isBot) {
                    console.log(
                        color(`\n ⟨ Comando no privado ⟩`, 'yellow'),
                        color(`\n➱ Comando: ${comando}`, 'green'),
                        color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
                        color(`\n➱ Nome: ${nome}`, 'green'),
                        color(`\n➱ Hora: ${hora}\n`, 'green'))
                } else if (!isBot) {
                    console.log(
                        color(`\n ⟨ Mensagem no privado ⟩`, 'yellow'),
                        color(`\n➱ Comando: ${color('Não', 'red')}`, 'green'),
                        color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
                        color(`\n➱ Nome: ${nome}`, 'green'),
                        color(`\n➱ Hora: ${hora}\n`, 'green'))
                }
            }
            switch (comando) {
                case "menu":
                    if (!isGroup) return enviar(resposta.grupo)
                    enviar(`${menu1(prefixo, sender.split("@")[0], pushname)}`)
                    //GetLogsCMD(cooh, info, `${prefixo}menu`, pushname, sender.split("@")[0], latensi.toFixed(4), status_msg.check)
                    break
                case "imagine":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)
                    if (q == '' || q == undefined || !q) return enviar(`\`\`\`[\`\`\` ⚠️ \`\`\]\`\`\ *Modo De Uso: ${prefixo}imagine _Texto A Ser Imaginado Como Uma Imagem>_*`)
                    const Imagine = new hercai.Hercai()
                    enviar(resposta.espere)
                    const cooldownImagine = await UserSchema.find({ telefone: `${sender.split('@')[0]}` })
                    cooldownImagine.map(async (doc1) => {
                        if (doc1.TimeImagine && doc1.TimeImagine > Date.now()) {
                            const countdownImagine = tempRuntime((doc1.TimeImagine - Date.now()) / 1000)
                            return cooh.sendMessage(from, { text: `Olá ${pushname} \`\`\`(\`\`\` +${sender.split("@")[0]} \`\`\`)\`\`\`, Está API Está Em Desenvolvimento, Para Uma Melhor Utilização Aguarde ${countdownImagine} Para Utilizar Novamente!` }, { quoted: info })
                        }

                        const repostaImagine = await Imagine.drawImage({ model: 'v2', prompt: `${q}` })
                        await UserSchema.findOneAndUpdate({ telefone: `${sender.split("@")[0]}` }, { telefone: `${sender.split("@")[0]}`, TimeImagine: (Date.now() + 10000) })

                        cooh.sendMessage(from, { image: { url: `${repostaImagine.url}` }, caption: `_A imagem pode conter conteúdo explícito, não nos responsabilizamos, as imagens têm melhor qualidade quando o prompt está em inglês._` }, { quoted: info })
                        //GetLogsCMD(cooh, info, `${prefixo}imagine`, pushname, sender.split("@")[0], latensi.toFixed(4), status_msg.check)
                    })
                    break

                case "registrar":
                case "registro":
                case "rg":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (isRegistro) return enviar(resposta.rg)
                    await UserSchema.create({
                        name: `${pushname}`,
                        telefone: `${sender.split("@")[0]}`,
                        vip: false,
                        money: 0,
                        cash: 0
                    })
                    cooh.sendMessage(from, { text: `\`\`\`・➤\`\`\` 👤 *Nome:* ${pushname} \`\`\`(\`\`\` ${sender.split("@")[0]} \`\`\`)\`\`\`\n\`\`\`・➤\`\`\` 🗓️ *Data De Registro:* ${moment().tz("America/Sao_Paulo", keepTime = true).format("DD/MM/YYYY")}\n️\`\`\`・➤\`\`\` ⌚ *Hora De Registro:* ${moment().tz("America/Sao_Paulo", keepTime = true).format("HH:mm:ss")} \`\`\`(\`\`\` Horário De Brasília \`\`\`)\`\`\`\n\n⚙️️ Registrado com sucesso` }, { quoted: info })
                    break
                case "work":
                case "trabalhar":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)
                    let timeoutWork = 600000
                    const WorkProcess = await UserSchema.find({ telefone: `${sender.split("@")[0]}` })
                    WorkProcess.map(async (doc1) => {
                        if (doc1.TimeWork !== null && timeoutWork - (Date.now() - doc1.TimeWork) > 0) {
                            const countdownWork = msFunction(timeoutWork - (Date.now() - doc1.TimeWork))
                            if (countdownWork.minutes > 0) return cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` ⚠️ Aguarde ${countdownWork.minutes} Minutos E ${countdownWork.seconds} Segundos Para Trabalhar Novamente!` })
                            if (countdownWork.minutes < 1 && countdownWork.seconds > 0) return cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` ⚠️ Aguarde ${countdownWork.seconds} Segundos Para Trabalhar Novamente!` })
                        }

                        const moneyCount = Math.floor(Math.random() * 500) + 100

                        var workJson = require('./arquivos/Json/Trabalhos.json')

                        var workDecision = workJson[Math.floor(Math.random() * workJson.length)]

                        await UserSchema.findOneAndUpdate({ telefone: `${sender.split("@")[0]}` }, { telefone: `${sender.split("@")[0]}`, TimeWork: Date.now(), $inc: { money: +moneyCount } })
                        cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` ✅ Você Trabalhou De ${workDecision} E Ganhou ${moneyCount}$. O Dinheiro Ja Foi Depositado Em Sua Carteira!` }, { quoted: info })

                    })
                    break

                case "imagesrc":
                    //if(!isGroup && from.split("@g.us")[0] != "120363207866579217@") return enviar(`\`\`\`=->\`\`\` Esse Comando So Pode Ser Executado No Grupo:\nhttps://chat.whatsapp.com/ICSI5z2gKcB9aEx4fZkdpQ`)
                    if(!q || q == "") return enviar(`\`\`\`=->\`\`\` Modo De Uso: ${prefixo}imagesrc Imagem Que Deseja Pesquisar`)

                    await fetch(`https://serpapi.com/search.json?engine=yandex_images&text=${q}`).then((api) => api.json()).then((json) => {

                        const resultadoImagem = json.images_results[Math.floor(Math.random() * (json.images_results).length)]

                        cooh.sendMessage(from, { image: { url: `${resultadoImagem.original}`}, caption: `\`\`\`=->\`\`\` 🌐 Status: ${json.search_metadata.status == "Sucess" ? "Sucesso!" : "Falhou!"}\n\`\`\`=->\`\`\` 🖊️ Titulo Da Imagem: ${resultadoImagem.title}\n\`\`\`=->\`\`\` 🃏 Dimensões Da Imagem: ${resultadoImagem.size.width}x${resultadoImagem.size.height} ` }, { quoted: info })
                    })
                break

                case "roubar":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)

                    if (!args[0] || args[0] == '') return enviar(`\`\`\`=->\`\`\` Modo De Uso: ${prefixo}roubar @Pessoa`)

                    const pRoubar1 = args[0].slice(1)

                    if (isNaN(pRoubar1)) return enviar(`\`\`\`=->\`\`\` Não Aceitamos Numero Em Forma De Texto (String)!`)

                    let timeoutRoubo = 900000

                    const Roubo = await RoubarSchema.find({ User: `Teste` })

                    Roubo.map(async (doc1) => {

                        if (doc1.Time !== null && timeoutRoubo - (Date.now() - doc1.Time) > 0) {

                            const countdownRoubo = msFunction(timeoutWork - (Date.now() - doc1.Time))
                            await cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` Você So Pode Roubar Daqui ${countdownRoubo.minutes} Minutos E ${countdownRoubo.seconds} Segundos`})
                            
                        } else {

                            const ValorRoubar = Math.floor(Math.random() * 200) + 1

                            await UserSchema.findOneAndUpdate({ telefone: `${pRoubar1}` }, { telefone: `${pRoubar1}`, $inc: { money: -ValorRoubar } })
                            await UserSchema.findOneAndUpdate({ telefone: `${sender.split("@")[0]}` }, { telefone: `${sender.split("@")[0]}`, $inc: { money: +ValorRoubar } })

                            await cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` *Vitima:* @${pRoubar1}\n\`\`\`=->\`\`\` *Ladrão:* @${sender.split("@")[0]}\n\`\`\`=->\`\`\` *Quantia Roubada:* ${ValorRoubar}$`, mentions: [`${pRoubar1}@s.whatsapp.net`, `${sender}`] })

                        }
                    })

                    break

                case "ship":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)

                    if (args[0] == '' || args[0] == undefined || !args[0]) return enviar(`\`\`\`=->\`\`\` Modo De Uso: ${prefixo}ship @Pessoa1> @Pessoa2`)
                    if (args[1] == '' || args[1] == undefined || !args[1]) {

                        Canvas.registerFont(resolve("./arquivos/Fontes/Super_Dream.ttf"), { family: "Super Dream" })
                        const canvas = Canvas.createCanvas(480, 195)
                        const ctx = canvas.getContext("2d")
                        let ImageLoad = 'https://i.imgur.com/A0Z7G6d.jpg'

                        //console.log(sender)

                        const user1Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png" // await cooh.profilePictureUrl(`${args[0].slice(1)}@s.whatsapp.net`, "image")
                        //if(!user1Avatar || user1Avatar == "item-not-found") user1Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png"
                        const user2Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png" //await cooh.profilePictureUrl(`${sender}`, "image")
                        //if(!user2Avatar || user2Avatar == "item-not-found") user2Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png"

                        const shipPercentage = Math.floor(Math.random() * 105)

                        const backgroundImage = await Canvas.loadImage(ImageLoad)
                        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

                        const centerX = canvas.width / 2
                        const centerY = canvas.height / 2

                        const faixa = await Canvas.loadImage('https://i.imgur.com/61XCaCh.png')

                        const faixaWidth = canvas.width - 48
                        const faixaHeight = 106;
                        const faixaX = centerX - faixaWidth / 2;
                        const faixaY = centerY - faixaHeight / 2.1
                        ctx.drawImage(faixa, faixaX, faixaY, faixaWidth, faixaHeight)

                        const user1Image = await Canvas.loadImage(user1Avatar)
                        const user2Image = await Canvas.loadImage(user2Avatar)

                        ctx.drawImage(user1Image, 50, 50, 100, 100)
                        ctx.drawImage(user2Image, 330, 50, 100, 100)

                        ctx.font = `50px Super Dream`;
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${shipPercentage}%`, canvas.width / 2, canvas.height / 1.6);

                        fs.writeFileSync('./Logs/ship.png',  canvas.toBuffer())

                        let messageA = ''
                        if (shipPercentage >= 40 && shipPercentage <= 50) {
                            messageA = 'Eles parecem ter uma boa conexão!';
                        } else if (shipPercentage >= 1 && shipPercentage <= 10) {
                            messageA = 'Hmmm, talvez seja impossível os dois virar um casal, mas não desista!';
                        } else if (shipPercentage >= 11 && shipPercentage <= 20) {
                            messageA = 'Hmmm, talvez ainda haja uma chance muito pequena!';
                        } else if (shipPercentage >= 21 && shipPercentage <= 39) {
                            messageA = 'Estou começando a acreditar que os dois possam ser um belo casal!';
                        } else if (shipPercentage >= 51 && shipPercentage <= 69) {
                            messageA = `Vai depender de @${args[0]}, por mim eu aprovo o casal!`;
                        } else if (shipPercentage >= 70 && shipPercentage <= 89) {
                            messageA = 'AWNNN QUE CASAL FOFO!, me convidem para o casamento...';
                        } else if (shipPercentage >= 90 && shipPercentage <= 105) {
                            messageA = `O amor transcendeu todos os limites!, @${sender.split("@")[0]} & @${args[0]}, o casamento dos dois está marcado para hoje!`
                        }

                        setTimeout(async () => {
                            if (shipPercentage >= 90 && shipPercentage <= 105) {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}`, mentions: [`${sender}`, `${args[0]}@s.whatsapp.net`] }, { quoted: info })
                            } else if (shipPercentage >= 51 && shipPercentage <= 69) {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}`, mentions: [`${args[0]}@s.whatsapp.net`] }, { quoted: info })
                            } else {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}` }, { quoted: info })
                            }
                        }, 200)

                    } else {

                        Canvas.registerFont(resolve("./arquivos/Fontes/Super_Dream.ttf"), { family: "Super Dream" })

                        const canvas = Canvas.createCanvas(480, 195)
                        const ctx = canvas.getContext("2d")
                        let ImageLoad = 'https://i.imgur.com/A0Z7G6d.jpg'

                        //const user1Avatar = await cooh.profilePictureUrl(`${args[0].slice(1)}@c.us`, 'image')
                        //const user2Avatar = await cooh.profilePictureUrl(`${args[1].slice(1)}@c.us`, 'image')

                        const user1Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png" // await cooh.profilePictureUrl(`${args[0].slice(1)}@s.whatsapp.net`, "image")
                        //if(!user1Avatar || user1Avatar == "item-not-found") user1Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png"
                        const user2Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png" //await cooh.profilePictureUrl(`${args[1].slice(1)}@c.us`, "image")
                        //if(!user2Avatar || user2Avatar == "item-not-found") user2Avatar = "https://coohzitos.tixte.co/r/sem-imagem-avatar.png"


                        const shipPercentage = Math.floor(Math.random() * 105)

                        const backgroundImage = await Canvas.loadImage(ImageLoad)
                        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

                        const centerX = canvas.width / 2
                        const centerY = canvas.height / 2

                        const faixa = await Canvas.loadImage('https://i.imgur.com/61XCaCh.png')

                        const faixaWidth = canvas.width - 48
                        const faixaHeight = 106;
                        const faixaX = centerX - faixaWidth / 2;
                        const faixaY = centerY - faixaHeight / 2.1
                        ctx.drawImage(faixa, faixaX, faixaY, faixaWidth, faixaHeight)

                        const user1Image = await Canvas.loadImage(user1Avatar)
                        const user2Image = await Canvas.loadImage(user2Avatar)

                        ctx.drawImage(user1Image, 50, 50, 100, 100)
                        ctx.drawImage(user2Image, 330, 50, 100, 100)

                        ctx.font = `50px Super Dream`;
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${shipPercentage}%`, canvas.width / 2, canvas.height / 1.6);

                        fs.writeFileSync('./Logs/ship.png', canvas.toBuffer())

                        let messageA = ''
                        if (shipPercentage >= 40 && shipPercentage <= 50) {
                            messageA = 'Eles parecem ter uma boa conexão!';
                        } else if (shipPercentage >= 1 && shipPercentage <= 10) {
                            messageA = 'Hmmm, talvez seja impossível os dois virar um casal, mas não desista!';
                        } else if (shipPercentage >= 11 && shipPercentage <= 20) {
                            messageA = 'Hmmm, talvez ainda haja uma chance muito pequena!';
                        } else if (shipPercentage >= 21 && shipPercentage <= 39) {
                            messageA = 'Estou começando a acreditar que os dois possam ser um belo casal!';
                        } else if (shipPercentage >= 51 && shipPercentage <= 69) {
                            messageA = `Vai depender de @${args[1]}, por mim eu aprovo o casal!`;
                        } else if (shipPercentage >= 70 && shipPercentage <= 89) {
                            messageA = 'AWNNN QUE CASAL FOFO!, me convidem para o casamento...';
                        } else if (shipPercentage >= 90 && shipPercentage <= 105) {
                            messageA = `O amor transcendeu todos os limites!, @${args[0]} & @${args[1]}, o casamento dos dois está marcado para hoje!`
                        }

                        setTimeout(async () => {
                            if (shipPercentage >= 90 && shipPercentage <= 105) {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}`, mentions: [`${args[0]}@s.whatsapp.net`, `${args[1]}@s.whatsapp.net`] }, { quoted: info })
                            } else if (shipPercentage >= 51 && shipPercentage <= 69) {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}`, mentions: [`${args[1]}@s.whatsapp.net`] }, { quoted: info })
                            } else {
                                await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/ship.png'), caption: `${messageA}` }, { quoted: info })
                            }
                        }, 200)
                    }

                    break
                case "doação":
                case "doar":
                case "doacao":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)
                    if (!args[0] || args[0] == '') return enviar(`\`\`\`=->\`\`\` Modo De Uso: ${prefixo}doar Valor Para Doar Pro Bot`)
                    if (isNaN(args[0])) return enviar(`\`\`\`=->\`\`\` Não Aceitamos O Valor Em Texto!`)
                    if(args[0].length >= 100) return enviar(`\`\`\`=->\`\`\` Não Aceitamos Valor Acima De R$:999`)
                    const pixGerador = PIX.static().setReceiverName(`${pushname}`)
                        .setReceiverCity('Brasil')
                        .setKey("a04team001@gmail.com")
                        .setDescription('Doação Para Manter A Hakina')
                        .setAmount(parseInt(args[0]))

                    const canvas = Canvas.createCanvas(1200, 1200)
                    const context = canvas.getContext('2d')
                    const qrCodeImage = await Canvas.loadImage(await pixGerador.getQRCode())
                    context.fillStyle = '#FFFFFF'
                    context.fillRect(0, 0, canvas.width, canvas.height)
                    context.drawImage(qrCodeImage, 0, 0, canvas.width, canvas.height)
                    fs.writeFileSync(`./Logs/qrcode.png`, canvas.toBuffer())

                    await cooh.sendMessage(from, { text: `Valor A Ser Pago É De *R$:${q}*` })
                    setTimeout(async () => {
                        await cooh.sendMessage(from, { image: fs.readFileSync('./Logs/qrcode.png'), caption: `Scaneie O QRCode Ou Copie O Codigo E Cole Em Seu Banco!` })
                    }, 100)
                    setTimeout(async () => {
                        await cooh.sendMessage(from, { text: `${pixGerador.getBRCode()}` })
                    }, 800)


                    break

                case "carteira":
                case "atm":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)
                    const atmProcess = await UserSchema.find({ telefone: `${sender.split("@")[0]}` })
                    atmProcess.map(async (doc1) => {

                        /*const money1 = doc1.money, cash1 = doc1.cash, vip1 = ""

                        if(!money1 || money1 == undefined) money1 = 0
                        if(!cash1 || cash1 == undefined) cash1 = 0
                        if(!doc1.vip || doc1.vip == undefined) vip1 = "Sem VIP"*/

                        cooh.sendMessage(from, { text: `\`\`\`=->\`\`\` 💸 *Carteira:* ${doc1.money >= 0 ? doc1.money : 0}\n\`\`\`=->\`\`\` 🏦 *Cash:* ${doc1.cash >= 0 ? doc1.cash : 0}\n\`\`\`=->\`\`\` 🌟 *VIP:* ${doc1.vip ? "Com VIP" : "Sem VIP"}` }, { quoted: info })
                    })
                    break

                case "beijar":
                case "kiss":
                    if (!isGroup) return enviar(resposta.grupo)
                    if (!isRegistro) return enviar(resposta.registro)
                    var kissList1 = [
                        './arquivos/Videos/Kiss/II1bakc.mp4',
                        './arquivos/Videos/Kiss/MzAjNdv.mp4',
                        './arquivos/Videos/Kiss/eKcWCgS.mp4',
                        './arquivos/Videos/Kiss/3aX4Qq2.mp4',
                        './arquivos/Videos/Kiss/uobBW9K.mp4'
                    ]
                    if (args[0] == '' || args[0] == undefined || !args[0]) return enviar(`❌ \`\`\`-\`\`\` Modo De Uso: ${prefixo}kiss @Pessoa1> @Pessoa2`)
                    if (args[1] == '' || args[1] == undefined || !args[1]) {

                        const kissUser1 = args[0].slice(1)

                        const kissR1 = fs.readFileSync(kissList1[Math.floor(Math.random() * kissList1.length)])


                        if (isNaN(kissUser1)) return enviar(`❌ \`\`\`-\`\`\` Modo De Uso: ${prefixo}kiss @Pessoa1> @Pessoa2`)

                        enviar(resposta.espere)
                        setTimeout(async () => {
                            await cooh.sendMessage(from, { video: kissR1, caption: `O(A) @${sender.split("@")[0]} Deu Um Beijo No(a) @${kissUser1}.`, gifPlayback: true, mentions: [`${sender}`, `${kissUser1}@s.whatsapp.net`] }, { quoted: info })
                            //GetLogsCMD(cooh, info, `${prefixo}kiss`, pushname, sender.split("@")[0], latensi.toFixed(4), status_msg.check)
                        }, 200)


                    } else {

                        const kissR1 = fs.readFileSync(kissList1[Math.floor(Math.random() * kissList1.length)])

                        const kissUser1 = args[0].slice(1)
                        if (isNaN(kissUser1)) return enviar(`❌ \`\`\`-\`\`\` Modo De Uso: ${prefixo}kiss @Pessoa1> @Pessoa2`)
                        const kissUser2 = args[1].slice(1)
                        if (isNaN(kissUser2)) return enviar(`❌ \`\`\`-\`\`\` Modo De Uso: ${prefixo}kiss @Pessoa1> @Pessoa2`)

                        enviar(resposta.espere)
                        setTimeout(async () => {
                            await cooh.sendMessage(from, { video: kissR1, caption: `O(A) @${kissUser1} Deu Um Beijo No(a) @${kissUser2}.`, gifPlayback: true, mentions: [`${kissUser1}@whatsapp.net`, `${kissUser2}@s.whatsapp.net`] }, { quoted: info })
                            //GetLogsCMD(cooh, info, `${prefixo}kiss`, pushname, sender.split("@")[0], latensi.toFixed(4), status_msg.check)
                        }, 200)

                    }

                    break
                /*
                case 'enquete': 
                message = {
                "messageContextInfo": {
                "messageSecret": "eed1zxI49cxiovBTUFLIEWi1shD9HgIOghONuqPDGTk="},
                "pollCreationMessage": {
                "options": [
                { "optionName": 'Opção 1' },
                { "optionName": 'Opção 2' },
                { "optionName": 'Opção 3' }],
                "name": `${data}`,
                "selectableOptionsCount": 0
                }}
                await cooh.relayMessage(from, message, {quoted: info })
                break
                */
                default:

                    const messType = Object.keys(info.message)[0]

                    //console.log(messType)

                    if (body.trim().split(/ +/).shift().toLocaleLowerCase().includes("@5527992462839")) return enviar(`Olá! Para Saber Mais Sobre Mim Digite O Meu Prefixo: ${prefixo}menu`)
            }
        } catch (e) {
            e = String(e)
            if (e.includes('this.isZero')) {
                return
            }
            console.error('\n %s', color(`➱ ${e}`, 'yellow'))
            console.log(color('\n « ! Crashlog ! »', 'red'), (color('Erro detectado! \n', 'yellow')))
        }
    })
}
connectToWhatsApp()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`O arquivo ${__filename} foi atualizado.\n`)
    process.exit()
})