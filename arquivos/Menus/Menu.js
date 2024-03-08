const menu1 = (prefixo, sender, pushname) => {
    return `
╭━〢⎙ Bem vindo ━━╮
┣ ⩺ Número: +${sender}
┣ ⩺ Nome: ${pushname}
╰━〢⎙ Ao menu ━━╯

╭━━〢⎙ Membros ━━╮
┣ ⩺ ${prefixo}rg
┣ ⩺ ${prefixo}doar
┣ ⩺ ${prefixo}cargos
╰━━〢⎙ Membros ️━━╯

╭━━〢⎙ Entretenimento ━━╮
┣ ⩺ ${prefixo}kiss
┣ ⩺ ${prefixo}ship
┣ ⩺ ${prefixo}imagine (Em Beta Fechada)
╰━━〢⎙ Entretenimento ️━━╯

╭━━〢⎙ Economia ━━╮
┣ ⩺ ${prefixo}work
┣ ⩺ ${prefixo}atm
┣ ⩺ ${prefixo}roubar
╰━━〢⎙ Economia ️━━╯
`
}

exports.menu1 = menu1