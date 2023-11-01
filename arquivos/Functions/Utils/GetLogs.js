module.exports = GetLogsCMD = (cooh, info, cmd, pushname, sender, resposta, stts) => {
    if (stts == "check") valuestts = "Enviado Sem Erros ✅"
    else if (stts == "warning") valuestts = "Enviado Mas Está Faltando Algo"
    else if (stts == "error") valuestts = "Não Enviado! ❌"
    cooh.sendMessage(`120363195238732618@g.us`, {
        text: `\`\`\`=->\`\`\` 📝 *Logs*\n\n\`\`\`>\`\`\` 📥 *Comando Recebido:* ${cmd}\n\`\`\`>\`\`\` 👤 *Usuario:* ${pushname} \`\`\`(\`\`\` +${sender} \`\`\`)\`\`\`\n\`\`\`>\`\`\` ⚠️ *Status:* ${valuestts}\n\`\`\`>\`\`\` ⏳ *Tempo De Resposta:* ${resposta}ms`
    }, { quoted: info })
}