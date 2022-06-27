let messages;
let userName;
let userNameObj;
let lastMessages;
let msgTo = 'Todos';
let msgType = 'message';
const messageBox = document.querySelector('.msgm-box');


// INITIAL SCREEN


function getName() {

    userName = document.querySelector('.input-user-name').value;
    userNameObj = {
        name: userName
    }

    showLoadingGif()

    setTimeout(() => {
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userNameObj);
        promise.then(validUserName);
        promise.catch(wrongUserName);
    }, 1000);

}

function showLoadingGif() {

    const loadingDiv = document.querySelector('.loading');
    const inputDiv = document.querySelector('.init-input-container');

    inputDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
}


//VALIDATE USER NAME AND GET MESSAGES FROM API


function validUserName() {
    alert('Bem vindo ao Chat UOL!');
    msgFrom = userName;
    getMessagesFromAPI();
}


function wrongUserName(error) {
    if (error.response.status === 400) {
        alert('Já existe um usuário com este nome! Por favor informe outro');
        window.location.reload()
    } else {
        alert('Erro desconhecido, insira um novo nome');
    }
}


function getMessagesFromAPI() {
    if (userName !== undefined) {
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promise.then(populateMessages);
    }
}


function populateMessages(promise) {
    if (promise.status === 200) {
        lastMessages = messages;
        messages = promise.data;
        renderMessages();
    } else {
        alert('Erro na captura da lista de mensagens');
    }
}


//KEEP USER STATUS ACTIVE


setInterval(() => {
    if (userName !== undefined) {
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userNameObj);
    }
}, 5000);


//MAIN SCREEN


function showMainScreen() {
    const headDiv = document.querySelector('.header');
    const contentDiv = document.querySelector('.content');
    const footerdiv = document.querySelector('.footer');
    const initScreenDiv = document.querySelector('.initial-screen');

    if (headDiv.classList.contains('hidden') && contentDiv.classList.contains('hidden') && footerdiv.classList.contains('hidden')) {
        initScreenDiv.classList.add('hidden');
        headDiv.classList.remove('hidden');
        contentDiv.classList.remove('hidden');
        footerdiv.classList.remove('hidden');
    }

}


function renderMessages() {
    const ulDiv = document.querySelector('ul');


    if (lastMessages[99].from === messages[99].from) {
        return;
    }

    ulDiv.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {
        let currentMessage = messages[i];
        const templateStatusLi = `
        <span class="room-status">(${currentMessage.time}) <strong> ${currentMessage.from} </strong> ${currentMessage.text}</span>`;
        const templateMessageLi = `
        <span class="public-message">(${currentMessage.time}) <strong>${currentMessage.from}</strong> para <strong>${currentMessage.to}</strong>: ${currentMessage.text}</span>`;
        const templatePrivateMessageLi = `
        <span class="private-message">(${currentMessage.time}) <strong>${currentMessage.from}</strong> reservadamente para <strong>${currentMessage.to}</strong>: ${currentMessage.text}</span>`;

        if (currentMessage.type === 'status') {
            ulDiv.innerHTML += templateStatusLi;
        }
        else if (currentMessage.type === 'message') {
            ulDiv.innerHTML += templateMessageLi;
        }
        else if (currentMessage.type === 'private_message' && (currentMessage.to === userNameObj.name || currentMessage.from === userNameObj.name)) {
            ulDiv.innerHTML += templatePrivateMessageLi;
        } else {
            continue;
        }

    }

    showMainScreen()

    const lastMessage = document.querySelector('ul').lastElementChild;
    lastMessage.scrollIntoView();
}


//KEEP UPDATING MESSAGES


setInterval(getMessagesFromAPI, 3000);


//SEND MESSAGE


messageBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
})

function sendMessage() {
    let message = document.querySelector('.msgm-box');

    if (msgTo != 'Todos' && msgType === 'message' ){
        msgTo = 'Todos';
    }

    const messageTemplate = {
        from: userName,
        to: msgTo,
        text: message.value,
        type: msgType
    }


    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageTemplate);
    promise.then(messageSent)
    promise.catch(messageError)
    message.value = "";
}

function messageSent() {
    getMessagesFromAPI();
}

function messageError() {
    alert('erro no envio da mensagem');
}


//SIDEBAR 


function showSidebar() {
    const sidebarDiv = document.querySelector('.side-bar-screen');
    sidebarDiv.classList.remove('hidden');

    const contentDiv = document.querySelector('.content');

    showOnlineUsers()

}

function hideSidebar() {
    let sidebarDiv = document.querySelector('.side-bar-screen');
    sidebarDiv.classList.add('hidden');

    const contentDiv = document.querySelector('.content');
    contentDiv.style.overflow = 'scroll';

}

function showOnlineUsers() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    promise.then((promise) => {
        const div = document.querySelector('.online-users');
        const onlineUsers = promise.data
        div.innerHTML =
            `<div onclick="selectUser(this)" class="user selected">
                <div data-identifier="participant">
                    <div class="ion">
                        <ion-icon name="people"></ion-icon>
                    </div>
                    <p>Todos</p>
                </div>
                <div class="check-user">
                    <ion-icon class="check-green" name="checkmark"></ion-icon>
                </div>
            </div>`
        for (let i = 0; i < onlineUsers.length; i++) {
            const name = onlineUsers[i].name;
            const templateDiv =
                `<div onclick="selectUser(this)" class="user">
                    <div data-identifier="participant">
                        <div class="ion">
                            <ion-icon name="people"></ion-icon>
                        </div>
                        <p>${name}</p>
                    </div>
                    <div class="check-user">
                    </div>
                </div>`
            div.innerHTML += templateDiv;
        }
    })
    const privacyRow = document.querySelector('.privacy-row');
    if (msgType === 'message'){
        privacyRow.innerHTML = `
            <div class="public-btn checked" onclick="selectPrivacy(this)" data-identifier="visibility">
                    <div>
                        <ion-icon name="lock-open"></ion-icon>
                        <p>Publico</p>
                    </div>
                    <div class="check-privacy">
                        <ion-icon class="check-green" name="checkmark"></ion-icon>
                    </div>
                </div>
                <div class="private-btn" onclick="selectPrivacy(this)" data-identifier="visibility">
                    <div>
                        <ion-icon name="lock-closed"></ion-icon>
                        <p>Privado</p>
                    </div>
                    <div class="check-privacy"></div>
            </div> `;
    } else {
        privacyRow.innerHTML = `
            <div class="public-btn" onclick="selectPrivacy(this)" data-identifier="visibility">
                    <div>
                        <ion-icon name="lock-open"></ion-icon>
                        <p>Publico</p>
                    </div>
                    <div class="check-privacy">
                    </div>
                </div>
                <div class="private-btn checked" onclick="selectPrivacy(this)" data-identifier="visibility">
                    <div>
                        <ion-icon name="lock-closed"></ion-icon>
                        <p>Privado</p>
                    </div>
                    <div class="check-privacy">
                        <ion-icon class="check-green" name="checkmark"></ion-icon>
                    </div>
            </div> `;
    }
}

setInterval(showOnlineUsers, 10000);

function selectUser(element) {
    const lastSelectedUser = document.querySelector('.selected');
    const checkedIconDiv = lastSelectedUser.querySelector('.check-user');
    const selectedUser = element;
    const uncheckedIcon = element.querySelector('.check-user');
    msgTo = selectedUser.querySelector('p').innerHTML;

    if (msgTo !== 'Todos' && msgType === 'private_message') {
        alert('Você não pode mandar uma mensagem privada no modo público');
        msgTo = 'Todos'
        return;
    }

    lastSelectedUser.classList.remove('selected');
    checkedIconDiv.innerHTML = "";
    selectedUser.classList.add('selected');
    uncheckedIcon.innerHTML = '<ion-icon class="check-green" name="checkmark"></ion-icon>'
}

function selectPrivacy(element) {
    const lastSelectedPrivacy = document.querySelector('.checked');
    const checkedIconDiv = lastSelectedPrivacy.querySelector('.check-privacy');
    const selectedPrivacy = element;
    const uncheckedIcon = element.querySelector('.check-privacy');
    msgType = selectedPrivacy.querySelector('p').innerHTML;

    if (msgTo === 'Todos' && msgType !== 'Publico') {
        alert('Escolha o usuário para o qual irá mandar a mensagem antes');
        msgType = 'message';
        return;
    }

    lastSelectedPrivacy.classList.remove('checked');
    checkedIconDiv.innerHTML = "";
    selectedPrivacy.classList.add('checked');
    uncheckedIcon.innerHTML = '<ion-icon class="check-green" name="checkmark"></ion-icon>'

    if (selectedPrivacy.querySelector('p').innerHTML === "Publico") {
        msgType = 'message';
    } else {
        msgType = 'private_message'
    }
}