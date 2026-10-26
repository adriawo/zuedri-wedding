# Pesquisa de bebidas | Zuzana & Adriano

O formulário do site está pronto, mas o GitHub Pages **não pode escrever em uma planilha sem um serviço de recebimento**. O arquivo `Code.gs` contém esse serviço, desenvolvido para Google Apps Script. Ele usa um identificador de resposta para evitar duplicação em tentativas repetidas.

## Publicar o recebimento (passo necessário uma única vez)

1. Abra a planilha: https://docs.google.com/spreadsheets/d/1FuSipSTJGKh2Yt_fp9IzioZf06roVaJOzKj89WKccNg/edit
2. Clique em **Extensões > Apps Script**, substitua o conteúdo de `Code.gs` pelo arquivo [Code.gs](./Code.gs) e salve.
3. Clique em **Implantar > Nova implantação > Aplicativo da Web**.
4. Selecione **Executar como: Eu** e **Quem tem acesso: Qualquer pessoa**. Autorize o acesso à planilha ao publicar.
5. Copie a URL que começa com `https://script.google.com/macros/s/` e termina em `/exec`.
6. Edite o arquivo [drinks-config.js](../drinks-config.js) no GitHub substituindo a string vazia pela URL, faça commit e aguarde o GitHub Pages publicar.
7. No convite, abra `#bebidas`, preencha a pesquisa, envie e confirme que uma linha foi criada na aba **Respostas** e refletida em **Resumo**.

**Para testar sem gravar dados reais:** nome "TESTE", chope 40%, branco 25%, tinto 20%, espumante 15%. Envie, confirme a nova linha na aba Respostas e remova a linha depois. Faça novo envio com "Não bebo álcool" para conferir os zeros.

## Funcionamento técnico

- A coleta usa JSONP via HTTPS, para superar as limitações CORS de um site estático. A resposta só é considerada gravada quando o servidor retorna `status: "ok"`.
- O link do Apps Script é público enquanto a pesquisa estiver aberta; qualquer pessoa que conheça o endereço poderá enviar respostas. O serviço valida os dados, mas **não garante uma resposta única por pessoa**. É adequado somente para esta fase de teste.
- O nome é opcional, limitado a 100 caracteres. Não são coletados e-mails ou telefones.
- O nome, se informado, segue na URL HTTPS da requisição. Pode constar em registros técnicos do serviço. Para maior privacidade em produção, recomenda-se migrar para requisições POST com um backend próprio.
- A configuração `drinks-config.js` fica pública. Não coloque tokens, chaves, senhas ou credenciais no arquivo.
- Restringir o compartilhamento da planilha **não encerra** a coleta pública do Apps Script. Quando quiser encerrar a pesquisa, remova a implantação do Apps Script e a URL em `drinks-config.js`.
- Para resetar os testes, exclua as linhas de dados a partir de `Respostas!A2:I`. Preserve o cabeçalho e a aba Resumo.

## Diagnóstico

Se o botão estiver desabilitado, a URL do Apps Script ainda não está em `drinks-config.js`. Se houver erro, verifique a implantação de acesso "Qualquer pessoa", o log de execuções no Apps Script e a URL `/exec` (não `/dev`).

## Importante: erro ao enviar / ambiente legado

Se o convite mostrar **"Não foi possível salvar sua resposta"** e a aba Respostas continuar vazia, verifique o **ambiente de execução** do projeto Google Apps Script.

O arquivo `Code.gs` usa JavaScript moderno e precisa do **ambiente Chrome V8**. No projeto Apps Script, abra **Configurações do projeto** e marque **Ativar ambiente de execução do Chrome V8** (ou configure `"runtimeVersion": "V8"` em `appsscript.json`). Salve.

Depois, em **Implantar > Gerenciar implantações**, selecione a implantação ativa, clique no ícone de editar, escolha **Versão: Nova versão** e **Implantar**. Isso atualiza a implantação mantendo a URL pública `/exec` usada pelo site.

Se persistir, abra **Execuções** no editor Apps Script para verificar mensagens do servidor e confirme que a implantação executa como **Eu** com acesso **Qualquer pessoa**. Não publique credenciais nem conceda acesso de edição à planilha para corrigir problemas no formulário.
