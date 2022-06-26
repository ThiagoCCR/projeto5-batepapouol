let messages;
let userName = prompt('Qual o seu lindo nome?');
let userNameObj;

function getName() {

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
},5000);


function validUserName() {
    alert('Bem vindo ao Chat UOL!');
    getMessagesFromAPI();
}

function wrongUserName(error) {
    if (error.response.status === 400) {
        alert('Já existe um usuário com este nome! Por favor informe outro');
        userName = prompt('Qual o seu lindo nome?');
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
    ulDiv.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {
        let currentMessage = messages[i];
        const templateStatusLi = `<li class="room-status">(${currentMessage.time}) ${currentMessage.from} ${currentMessage.text}</li>`;
        const templateMessageLi = `<li class="public-message">(${currentMessage.time}) ${currentMessage.from} para ${currentMessage.to}: ${currentMessage.text}</li>`;
        const templatePrivateMessageLi = `<li class="private-message">(${currentMessage.time}) ${currentMessage.from} reservadamente para ${currentMessage.to}: ${currentMessage.text}</li>`;

        if (currentMessage.type === 'status'){
            ulDiv.innerHTML += templateStatusLi;
        }
        else if (currentMessage.type === 'message'){
            ulDiv.innerHTML += templateMessageLi;
        }
        else if (currentMessage.type === 'private_message' && (currentMessage.to === userNameObj.name || currentMessage.from === userNameObj.name)){
            ulDiv.innerHTML += templatePrivateMessageLi;
        } else {
            continue;
        }
       
    }
    const lastMessage = document.querySelector('ul').lastElementChild;
    lastMessage.scrollIntoView();
}

setInterval(getMessagesFromAPI, 3000);

function sendMessage(){
    const message = document.querySelector('input').value;
    const messageTemplate = {
        from: userName,
        to: "Todos",
        text: message,
        type: "message"
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageTemplate);
    promise.then(messageSent)
    promise.catch(messageError)
}

function messageSent(){
    alert('mensagem enviada');
    clearUl = true;
    getMessagesFromAPI();
}

function messageError(){
    alert('você não está mais online, entre novamente');
    window.location.reload()
}


//SIDEBAR 

function showSidebar(){
    const sidebarDiv = document.querySelector('.side-bar-screen');
    sidebarDiv.classList.remove('hidden');

    const contentDiv = document.querySelector('.content');
    contentDiv.style.overflow = 'hidden';

    showOnlineUsers()

}

function hideSidebar(){
    let sidebarDiv = document.querySelector('.side-bar-screen');
    sidebarDiv.classList.add('hidden');

    const contentDiv = document.querySelector('.content');
    contentDiv.style.overflow = 'scroll';

}

function showOnlineUsers(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    promise.then((promise)=> {
        const div = document.querySelector('.online-users');
        const onlineUsers = promise.data
        div.innerHTML = `<div data-identifier="participant"><div><ion-icon name="people"></ion-icon><p>Todos</p></div><div><ion-icon name="checkmark"></ion-icon></div></div>`
        for (let i = 0; i< onlineUsers.length; i++){
            const name = onlineUsers[i].name;
            const templateDiv = `<div><div><ion-icon name="people"></ion-icon><p>${name}</p></div><div></div></div>`
            div.innerHTML += templateDiv;
        }
    })
}

setInterval(showOnlineUsers,10000);
