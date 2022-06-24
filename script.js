let messages;
let userName = prompt('Qual o seu lindo nome?');

let userNameObj;

function getName() {

    while (typeof userName !== 'string') {
        userName = prompt('Qual o seu lindo nome?');
    }

    userNameObj = {
        name: userName
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userNameObj);

    promise.then(validUserName);
    promise.catch(wrongUserName);

}

getName()

setInterval(()=>{
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userNameObj);
    console.log('nome resetado')
},5000);


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
    const ulDiv = document.querySelector('ul');

    for (let i = 0; i < messages.length; i++) {
        let currentMessage = messages[i];
        const templateStatusLi = `<li class="room-status">(${currentMessage.time}) ${currentMessage.from} ${currentMessage.text}</li>`;
        const templateMessageLi = `<li class="public-message">(${currentMessage.time}) ${currentMessage.from} para ${currentMessage.to}: ${currentMessage.text}</li>`;
        const templatePrivateMessageLi = `<li class="private-message">(${currentMessage.time}) ${currentMessage.from} reservadamente para ${currentMessage.to}: ${currentMessage.text}</li>`;

        if(currentMessage.type === 'status'){
            ulDiv.innerHTML += templateStatusLi;
        } else if (currentMessage.type === 'message'){
            ulDiv.innerHTML += templateMessageLi;
        } else {
            ulDiv.innerHTML += templatePrivateMessageLi;
        }
    }
}

function sendMessage(){
    const message = document.querySelector('input').value;
    const messageTemplate = {
        from: userName,
        to: "Todos",
        text: message,
        type: "message"
    }

    console.log(messageTemplate);

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageTemplate);
    promise.then(messageSent)
    promise.catch(messageError)
}

function messageSent(){
    alert('mensagem enviada');
    getMessagesFromAPI();
}

function messageError(){
    alert('deu ruim');

}
