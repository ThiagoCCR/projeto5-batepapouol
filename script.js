let messages;
let userName;
let userNameObj;
let lastMessages;
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
    if (userName !== undefined){
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promise.then(populateMessages);
    }
}


function populateMessages(promise) {
    if (promise.status === 200) {
        lastMessages = messages;
        messages = promise.data;
        console.log(messages)
        renderMessages();
    } else {
        alert('Erro na captura da lista de mensagens');
    }
}


//KEEP USER STATUS ACTIVE


setInterval(() => {
    if (userName !== undefined){
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
  

    if (lastMessages[99].from === messages[99].from){
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
        <span class="private-message">(${currentMessage.time}) <strong>${currentMessage.from}</strong> reservadamente para <strong>${currentMessage.to}?</strong>: ${currentMessage.text}</span>`;

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

messageBox.addEventListener("keypress", function(e){
    if (e.key === "Enter") {
        sendMessage();
    }
})

function sendMessage() {
    let message = document.querySelector('.msgm-box');

    const messageTemplate = {
        from: userName,
        to: "Todos",
        text: message.value,
        type: "message"
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageTemplate);
    promise.then(messageSent)
    promise.catch(messageError)
    message.value = "";
}

function messageSent() {
    clearUl = true;
    getMessagesFromAPI();
}

function messageError() {
    alert('você não está mais online, entre novamente');
    window.location.reload()
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
}

setInterval(showOnlineUsers, 10000);

function selectUser(element){
    const lastSelectedUser = document.querySelector('.selected');
    const checkedIconDiv = lastSelectedUser.querySelector('.check-user');
    const selectedUser = element;
    const uncheckedIcon = element.querySelector('.check-user');

    lastSelectedUser.classList.remove('selected');
    checkedIconDiv.innerHTML = "";
    selectedUser.classList.add('selected');
    uncheckedIcon.innerHTML = '<ion-icon class="check-green" name="checkmark"></ion-icon>'
}

function selectPrivacy(element){
    const lastSelectedPrivacy = document.querySelector('.checked');
    const checkedIconDiv = lastSelectedPrivacy.querySelector('.check-privacy');
    const selectedPrivacy = element;
    const uncheckedIcon = element.querySelector('.check-privacy');

    lastSelectedPrivacy.classList.remove('checked');
    checkedIconDiv.innerHTML = "";
    selectedPrivacy.classList.add('checked');
    uncheckedIcon.innerHTML = '<ion-icon class="check-green" name="checkmark"></ion-icon>'
}


