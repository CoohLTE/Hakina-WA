#!/bin/bash
clear
PS3="Escolha Uma Opcao: "
cal=("Enviar" "Receber" "Sair")
select i in "${cal[@]}" ; do
   case $i in
     "Enviar")
        echo "Enviando Para O Git..."
        git add .
        git commit -am "v0.0.1"
        git push https://coohcooh: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@github.com/CoohCooh/LorittaMD.git main
        echo "Git Enviado"
        break
        ;;
     "Receber")
        echo "Atualizando Diretorio..."
        git pull https://coohcooh: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@github.com/CoohCooh/LorittaMD.git main
        echo "Diretorio Atualizado"
        break
        ;;
     "Sair")
        break
        ;;
      *)
        echo "Opcao Invalida $REPLY"
        ;;
   esac
done