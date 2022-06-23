let messages;

function getName() {
    userName = prompt('Qual o seu lindo nome?');

    while (typeof userName !== 'string') {
        userName = prompt('Qual o seu lindo nome?');
    }

    const userNameObj = {
        name: userName
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userNameObj);


    promise.then(validUserName);
    promise.catch(wrongUserName);

}

getName()

function validUserName() {
    alert('Bem vindo ao Chat UOL!');
    getMessagesFromAPI();
}

function wrongUserName(error) {
    if (error.response.status === 400) {
        alert('Já existe um usuário com este nome! Por favor informe outro');
        getName();
    } else {
        alert('Erro desconhecido, insira um novo nome');
    }
}

function getMessagesFromAPI() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(populateMessages);
}


function populateMessages(promise) {
    if (promise.status === 200) {
        messages = promise.data;
        renderMessages();
    } else {
        alert('Erro na captura da lista de mensagens');
    }
}

function renderMessages() {
    const templateStatusLi = `<li>(${currentMessage.time}) ${currentMessage.from} ${currentMessage.Text}</li>`;
    const templateMessageLi = `<li>(${currentMessage.time}) ${currentMessage.from} para ${currentMessage.to}: ${currentMessage.text}</li>`;
    const templatePrivateMessageLi = `<li>(${currentMessage.time}) ${currentMessage.from} reservadamente para ${currentMessage.to}: ${currentMessage.text}</li>`;
    const ulDiv = document.querySelector('ul');

    for (let i = 0; i < messages.length; i++) {
        let currentMessage = messages[i];

        if(currentMessage.type === 'status'){
            ulDiv.innerHTML += templateStatusLi;
        } else if (currentMessage.type === 'message'){
            ulDiv.innerHTML += templateMessageLi;
        } else {
            ulDiv.innerHTML += templatePrivateMessageLi;
        }



    }




}

