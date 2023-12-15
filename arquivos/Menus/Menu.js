const menu1 = (prefixo, sender, pushname) => {
    return `
╭━〢⎙ Bem vindo ━━╮
┣ ⩺ Número: +${sender}
┣ ⩺ Nome: ${pushname}
╰━〢⎙ Ao menu ━━╯

╭━━〢⎙ Membros ━━╮
┣ ⩺ ${prefixo}rg
┣ ⩺ ${prefixo}kiss
┣ ⩺ ${prefixo}imagine
┣ ⩺ ${prefixo}doar
╰━━〢⎙ Membros ️━━╯

╭━━〢⎙ Economia ━━╮
┣ ⩺ ${prefixo}work
┣ ⩺ ${prefixo}atm
╰━━〢⎙ Economia ️━━╯


`
}

exports.menu1 = menu1